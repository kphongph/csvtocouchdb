var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var csv = require('csv-parser');
var streamBuffers = require('stream-buffers');
var util = require('./couchdb-util');

var schema = [
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

module.exports = function(opts) {
  var opts = opts || {};
  return through.obj(function(file,enc,callback) {
    var _this = this;
    var stream = csv({raw:false,separator:',',escape: '"',quote: '"'});
    if(file.isBuffer()) {
      var map_headers = {};
      var re_map_headers = {};
      var working_type = [];
      var docs = [];
     
      var readStream = new streamBuffers.ReadableStreamBuffer();
      readStream.put(file.contents);
      readStream.stop();
      readStream.pipe(stream)
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
          tmp['csv_md5'] = util.hash_row(tmp);
          docs.push(tmp);
        });
      })
      .on('end',function() {
        file.contents = new Buffer(JSON.stringify(docs));
        _this.push(file);
        callback();
      });
    }
  });
};
