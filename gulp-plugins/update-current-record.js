var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

var nsy = new gutil.PluginError('test', {
   message: 'Not Support Yet'
});

var get_docs = function(opts,cb) {
  var retrieved = 0;
  var obj_list = [];
  if(opts.list.length==0) cb([]);
  opts.list.forEach(function(id) {
    var options = {
      url:opts.url+'/'+id,
      method:'GET'
    }
    request(options,function(err,res,body) {
      if(err) throw new gutil.PluginError('update',err);
      retrieved++;
      var obj = JSON.parse(body);
      if(!opts.set_current) {
        delete obj['current'];
      } else {
        obj['current']='Y';
      }
      obj_list.push(obj);
      if(retrieved==opts.list.length) cb(obj_list);
    });
  });
};

var get_study_records = function(url,cid,cb) {
  var design = '/_design/student/_view/study_records';
  design += '?startkey=["'+cid+'"]&endkey=["'+cid+'",{}]';
  request({
    method: 'GET',
    url:url+design
  },function(err,response,body) {
    if(err) throw new gutil.PluginError('update-current-record',err);
    var res= JSON.parse(body);
    var max = 0;
    var current_max = [];
    var max_id = null;
    var max_obj = [0,0];
    if(res.rows.length==0) cb([]);
    res.rows.forEach(function(row) {
      var record_as = row.key[1].split('/');
      var year = parseInt(record_as[0],10);
      var time = parseInt(record_as[1],10);
      if(row.key[2]!=0) current_max.push(row.id);
      if(max_obj[0]<year) {
        max_obj[0]=year;  
        max_obj[1]=time;
      } else {
        if(max_obj[0]==year) {
          if(max_obj[1]<time) max_obj[1]=time;
        }
      }
    });

    var count_max = 0;
    var recent = max_obj[0]+'/'+max_obj[1];
    var set_list = [];
    var clear_list = [];
    res.rows.forEach(function(row) {
      if(row.key[1]==recent && (row.key[2]!=1)) {
        set_list.push(row.id);
      } 
      if(row.key[1]!=recent && (row.key[2]==1)) { 
        clear_list.push(row.id);
      }
    });

    if(set_list.length==0 && clear_list.length==0) { 
      cb([]);
    } else {
      var _docs = [];
      get_docs({url:url,list:clear_list,set_current:false},function(cdocs) {
        _docs.push.apply(_docs,cdocs);
        get_docs({url:url,list:set_list,set_current:true},function(sdocs) {
          _docs.push.apply(_docs,sdocs);
          cb(_docs)
        });
      });
    }
  });
};

module.exports = function(url,opts) {
  var opts = opts || {};

  return through.obj(function(file,enc,callback) {
    var self = this;
    var _basename = path.basename(file.path,'.csv').split('_');
    var sid = _basename[2];
    var record = _basename[0]+'/'+parseInt(_basename[1],10);

    var design = '/_design/dmc/_view/by_school';
    design += '?startkey=["'+sid+'","'+record+'"]';
    design += '&endkey=["'+sid+'","'+record+'",{}]';
    design += '&group_level=4';

    // gutil.log(url+design);

    request.get(url+design,function(err,response,body) {
      var res = JSON.parse(body);
      // gutil.log('found '+res.rows.length);
      var count = 0;
      if(res.rows.length == 0) 
        callback(new gutil.PluginError('test','not found records'));
      var result = [];
      res.rows.forEach(function(row) {
        // gutil.log(record,sid,row.key[3]);
        get_study_records(url,row.key[3],function(docs) {
          count++;
          result.push.apply(result,docs);
          if(count == res.rows.length) {
            file.contents = new Buffer(JSON.stringify(result,null,2));
            self.push(file);
            callback(null);
          }
        });
      });
    });
  });
};
