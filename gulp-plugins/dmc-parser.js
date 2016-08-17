var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var csv = require('csv-parser');
var util = require('./util');
var fs = require('fs');
var path = require('path');

var schema = [
/*
  {
    type:'student',  // dmc
    fields:[
      'efPeZGe28XhJ+cIUhqLSBQ==', // cid
      'AmrB7fxDKndu3eD/JTBxQQ==', // gender
      'mXHaTYOmL4k8kjOrVFS+4A==', // title
      'sFZFZLbpd2GLWX/6T/bAFw==', // first name
      'SdY5d42O0senWB3pVr0UrQ==', // last name
      'ui7YONiWMpAguuHUECvHtg==', // first name (en)
      '5FxsOSAwP3S1tMu/zhZ1Mg==', // last name (en)
      'PfewC115PY7G19xHOoyC6Q=='  // birthdate
    ]
  },
*/
  {
    type:'dmc',  // dmc
    fields:[
      'efPeZGe28XhJ+cIUhqLSBQ==', // cid
      'L5hcQqye69tMkJGifwjraA==', // school id
      'FZEZ8EDgrK3sM9aUjMikeg==', // study grade
      'XaPpI0R6r5+W+pmCzR70FQ==', // study room
      'moqfZUbSh1Yv+b9EoEscSg==',  // student id
      'record_as'
    ]
  }
];


module.exports = function(options) {
  var opts = options?options:{};
  return through.obj(function(file,enc,callback) {
    var self = this;
    var stream = csv({raw:false,quote:'',escape:''});
    var seq = 1;
    if(file.isBuffer()) {
      var map_headers = {};
      var re_map_headers = {};
      var working_type = [];
      var docs = [];
      gutil.log('parsing',file.path);
      
      var _file = path.parse(file.path);
      var _items = path.basename(_file.dir).split('_');
      opts['record_as'] = _items[0]+'/'+parseInt(_items[1],10);
      var total_records = -1;
      fs.createReadStream(file.path)
      .pipe(through(function(chunk,enc,cb) {
        for(var i=0;i<chunk.length;i++) {
          if(chunk[i]==34)  {
            chunk[i]=0;
          }
          if(chunk[i]==10) total_records++;
        }
        this.push(chunk);
        cb();
      }))
      .pipe(stream)
      .on('headers',function(headers) {
         headers.forEach(function(val) {
           map_headers[val] = util.thai_hash(val);
           re_map_headers[map_headers[val]] = val;
         });
         schema.forEach(function(_schema) {
           var missing = false;
           _schema.fields.forEach(function(field) {
             if(!re_map_headers[field] && !opts[field]) 
               missing = true;
           });
           if(!missing) working_type.push(_schema);
         });
      })
      .on('data',function(data) {
        working_type.forEach(function(_schema) {
          var tmp = {'type':_schema.type};
          _schema.fields.forEach(function(field) {
            tmp[field] = data[re_map_headers[field]]?
              data[re_map_headers[field]]:opts[field];
          });
          tmp['_id'] = 'csv_'+util.hash_row(tmp);
          docs.push(tmp);
          if(docs.length == opts.split) { 
            var sfile = new gutil.File({
               base: path.join(__dirname),
               cwd:__dirname,
               path:path.join(__dirname,
                 _file.name+'_'+seq+_file.ext)
            });
            seq++;
            var doc= {'docs':docs};
            gutil.log(docs.length,_file.name);
            sfile.contents = new Buffer(JSON.stringify(doc,null,2));
            self.push(sfile);
            docs = [];
          }
        });
      })
      .on('end',function() {
        gutil.log('parsed ',file.path);
        if(docs.length > 0) {
          var doc= {'docs':docs};
          var sfile = new gutil.File({
            base: path.join(__dirname),
            cwd:__dirname,
            path:path.join(__dirname,
              _file.name+'_'+seq+_file.ext)
          });
          gutil.log(docs.length,_file.name);
          sfile.contents = new Buffer(JSON.stringify(doc,null,2));
          self.push(sfile);
        }
        callback(null);
      });
    }
  });
};
