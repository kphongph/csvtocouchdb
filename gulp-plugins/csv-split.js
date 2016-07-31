var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');
var csv = require('csv-parser');
var fs = require('fs');
var path = require('path');

var PLUGIN_NAME = 'csv-split';

var debug = new gutil.PluginError(PLUGIN_NAME,'debug');

var write_csv_line = function(arr) {
  var quoted_array = arr.map(function(item) {
    return '\"' + item + '\"';
  });
  return quoted_array.toString() + '\n';
};


var split = function(opts,data) {
  var self = this;
  return through.obj(function(chunk,enc,cb) {
    var name = chunk[opts.group_by];
    var write_obj = {'name':name,'data':chunk};
    this.push(write_obj);
    cb();
  });
};

module.exports = function(opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    var self=this;
    var stream = csv({
      raw:false,
      separator:','
    });

    gutil.log(file.path);
    var contents = {};

    fs.createReadStream(file.path).pipe(stream)
    .pipe(split(opts))
    .on('data',function(data) {
      if(contents[data.name]) {
       var str = write_csv_line(_.values(data.data));
       contents[data.name]['content'] += str;
      } else {
       contents[data.name] = {'name':data.name};
       var str = write_csv_line(_.keys(data.data));
       str += write_csv_line(_.values(data.data));
       contents[data.name]['content'] = str;
      }
    })
    .on('end',function() {
      var records = file.path.split('/');
      var parent_dir = records[records.length-2];

      for(var key in contents) {
        var tmp = new gutil.File({
          base : path.join(__dirname,'./schools'),
          cwd: __dirname,
          path: path.join(__dirname,'./schools/'+parent_dir+'_'+key+'.csv'),
          contents: new Buffer(contents[key].content)
        });
        self.push(tmp);
      }
      callback(null);
    });
  });
}
