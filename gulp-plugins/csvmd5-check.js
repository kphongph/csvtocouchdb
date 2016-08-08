var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');

var check_exists = function(dbUrl,docs,idx,newdocs,cb) {
  gutil.log(idx+'/'+docs.length+' ('+newdocs.length+') '+file_name);
  if(idx==docs.length) { 
    cb(null,newdocs);
  } else {
    var md5 = docs[idx].csv_md5;
    var request_url = dbUrl + '/_design/csv/_view/_csv_md5?key="'+md5+'"';
    request(request_url, function(err,response,body) {
      if(!err) {
        var json_obj = JSON.parse(body);
        if(json_obj.rows) {
          if(json_obj.rows.length == 0)  {
            newdocs.push(docs[idx]);
            check_exists(dbUrl,docs,idx+1,newdocs,cb);
          } else {
            check_exists(dbUrl,docs,idx+1,newdocs,cb);
          }
        } else {
          cb(json_obj);
        }
      } else {
        cb(err);
      }
    });
  }
};

var file_name = null;

module.exports = function(dbUrl) {
  return through.obj(function(file,enc,callback) {
    var _this = this;
    var new_docs = [];
    var count = 0;
    file_name = file.basename?file.basename:file.path;
    if(file.isBuffer()) {
      var docs = JSON.parse(file.contents.toString());
      gutil.log('check md5',file.path);
      check_exists(dbUrl,docs,0,[],function(err,newdocs) {
        if(err) { 
          gutil.log(err);
          callback(err);
        }
        file.contents = new Buffer(JSON.stringify(newdocs));
        _this.push(file);
        callback();
      });
    }
  });
};
