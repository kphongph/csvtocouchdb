var request = require('request');
var through = require('through2');
var gutil = require('gulp-util')

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

module.exports = function(url,opts) {
  var opts = opts || {};

  return through.obj(function(file,enc,callback) {
    if(file.isBuffer()) {
      var cid = file.contents.toString();
      var design = '/_design/student/_view/study_records';
      design+='?startkey=["'+cid+'"]&endkey=["'+cid+'",{}]';
      var _this = this;
      request({
        method: 'GET',
        url:url+design
      },function(err,response,body) {
        if(err) callback(err);
        var res= JSON.parse(body);
        var max = 0;
        var current_max = [];
        var max_id = null;
        var max_obj = [0,0];
        // gutil.log('check  '+cid);
        // gutil.log(JSON.stringify(res,null,2));
        if(res.rows.length==0) {
          gutil.log('no record '+cid);
          callback();
        }
        res.rows.forEach(function(row) {
          var record_as = row.key[1].split('/');
          var year = parseInt(record_as[0],10);
          var time = parseInt(record_as[1],10);
          if(row.key[2]) current_max.push(row.id);
          if(max_obj[0]<year) {
            max_obj[0]=year;  
            max_obj[1]=time;
          } else {
            if(max_obj[0]==year) {
              if(max_obj[1]<time) {
                max_obj[1]=time;
              }
            }
          }
        });

        var count_max = 0;
        var recent = max_obj[0]+'/'+max_obj[1];
        var set_list = [];
        var clear_list = [];
        res.rows.forEach(function(row) {
          if(row.key[1]==recent && !row.key[2]) {
            set_list.push(row.id);
          } 
          if(row.key[1]!=recent && row.key[2]) { 
            clear_list.push(row.id);
          }
        });

        if(set_list.length == 0 && clear_list.length==0) { 
          file.contents = new Buffer('[]');
          gutil.log('up-to-date '+cid);
          _this.push(file);
          callback(null);
        } else {
          var _docs = [];
          get_docs({url:url,list:clear_list,set_current:false},function(cdocs) {
            _docs.push.apply(_docs,cdocs);
            get_docs({url:url,list:set_list,set_current:true},function(sdocs) {
              _docs.push.apply(_docs,sdocs);
              gutil.log('updating '+cid);
              file.contents = new Buffer(JSON.stringify(_docs,null,2));
              _this.push(file);
              callback(null);
            });
          });
        }
      });
    }
  });
};
