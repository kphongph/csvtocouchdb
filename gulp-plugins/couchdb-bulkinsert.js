var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');

module.exports = function(url,opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    gutil.log('inserting',file.path);
    if(file.isBuffer()) {
      var json = JSON.parse(file.contents.toString());
      var _this = this;
      if(json.length == 0) {
        this.push(file);
        callback();
      } else {
        var docs = {'docs':json};
        request({
          url:url+'/_bulk_docs',
          method: 'POST',
          json:true,
          headers: {
            'content-type':'application/json'
          },
          body:docs
        },function(err,response,body) {
          if(err) callback(err);
          file.contents = new Buffer(body);
          _this.push(file);
          callback();
        });
      }
    }
  });
};
