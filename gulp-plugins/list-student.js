var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

module.exports = function(url,opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    var _this = this;
    if(file.isBuffer()) {
      var docs = JSON.parse(file.contents.toString());
      docs.rows.forEach(function(doc) {
        if(doc.value == 1) {
          var file = new gutil.File({
             base:path.join(__dirname,'.'),
             cwd: __dirname,
             path: path.join(__dirname,doc.key[0])
          });
          file.contents = new Buffer(doc.key[0]);
          _this.push(file);
        }
      });
    }
    callback();
  });
};
