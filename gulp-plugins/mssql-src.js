var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');
var sql = require('mssql');
var fs = require('fs');

var write_csv_line = function(arr) {
  var quoted_array = arr.map(function(item) {
    return '\"' + item + '\"';
  });
  return quoted_array.toString() + '\n';
};

module.exports = function(opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    var self = this;
    gutil.log(file.path);
    var query = file.contents.toString();
    sql.connect(opts.config,function(err) {
      if(err) throw err;
      var request = new sql.Request();
      var result = [];
      gutil.log('connected');
      request.query(query);
      request.on('recordset',function(columns) {
        gutil.log(JSON.stringify(columns));
      });
      var count = 0;
      var str = '';
      request.on('row',function(row) {
       if(str.length==0) {
         str += write_csv_line(_.keys(row));
         str += write_csv_line(_.values(row));
       } else {
         str += write_csv_line(_.values(row));
       }
      });

      request.on('done',function() {
        file.contents = new Buffer(str);
        self.push(file);
        callback();
      });
    });
  });
}
