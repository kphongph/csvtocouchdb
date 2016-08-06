var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');

var is_exists = function(dbUrl,md5,cb) {
  // gutil.log(md5);
  var request_url = dbUrl + '/_design/csv/_view/_csv_md5?key="'+md5+'"';
  request(request_url, function(err,response,body) {
    if(!err) {
      var json_obj = JSON.parse(body);
      if(json_obj.rows) {
        if(json_obj.rows.length == 0)  {
          cb(null,false);
        } else {
          cb(null,true);
        }
      } else {
        cb(json_obj,null);
      }
    } else {
      cb(err,null);
    }
  });
};

module.exports = function(dbUrl) {
  return through.obj(function(file,enc,callback) {
    var _this = this;
    var new_docs = [];
    var count = 0;
    if(file.isBuffer()) {
      var docs = JSON.parse(file.contents.toString());
      gutil.log('check md5',file.path);
      docs.forEach(function(doc) {
        is_exists(dbUrl,doc.csv_md5,function(err,exists) {
          count++;
          gutil.log('checked md5 '+count+'/'+docs.length);
          if(err) { 
             gutil.log(err);
             callback(err);
          }
          if(!exists) {
            new_docs.push(doc);
          } 
          if(count == docs.length) {
            file.contents = new Buffer(JSON.stringify(new_docs));
            _this.push(file);
            callback();
          }
        });
      });
    }
  });
};
