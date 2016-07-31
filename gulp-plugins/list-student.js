var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

module.exports = function(url) {
  url+='/_design/student/_view/by_cid?group_level=1';

  var query = function(limit,skip,cb) {
    request.get(url+'&limit='+limit+'&skip='+skip,function(err,res,body) {
      var docs = JSON.parse(body);
      var file_list = [];
      docs.rows.forEach(function(doc) {
        if(doc.value==1) {
          var tmp = new gutil.File({
            base:path.join(__dirname,'./students'),
            cwd:__dirname,
            path:path.join(__dirname,'./students/'+doc.key[0]),
            contents: new Buffer(doc.key[0])
          });
          file_list.push(tmp);
        }
      });
      cb(docs.rows.length,file_list);
    });
  }

  var stream = through.obj(function(file,enc,callback) {
    var self = this;
    var limit = 5000;

    var _repeat = function(skip) {
      query(limit,skip,function(records,files) {
        gutil.log((skip+records)+' retrieved');
        files.forEach(function(_file) { 
          self.push(_file);
        });

        if(records == limit) {
          _repeat(skip+records);
        } else {
          callback(null);
        }
      });
    };

    _repeat(0);
  });

  stream.write();

  return stream;
};
