var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var csv = require('csv-parser');
var util = require('./util');
var fs = require('fs');

var schema = [
  {
    type:'pop_info',
    fields:[
      "IDCARD","SUR_CODE","PRE_NAME","NAME1",
      "NAME2","BIRTHD","BIRTHD_DD","BIRTHD_MM",
      "BIRTHD_YY","BIRTHD_NEW","SEXCODE","SEX",
      "NATIONALIT","HOUSECODE","HOUSENUM","V_CODE",
      "VILLAGENO","ALLEY","LANE","ROAD","T_CODE",
      "T_NAME","D_NAME","P_NAME","AGE","SOURCE","SEQ","sequenceNumber"
    ]
  }
];

module.exports = function() {
  var opts = {};
  return through.obj(function(file,enc,callback) {
    var self = this;
    var stream = csv({raw:false,separator:',',escape: '"',quote: '"'});
    if(file.isBuffer()) {
      var map_headers = {};
      var working_type = [];
      var docs = [];
      gutil.log('parsing',file.path);
      
      /*
      var _file = file.path.split('/');
      var _items = _file[_file.length-1].split('_');
      opts['record_as'] = _items[0]+'/'+parseInt(_items[1],10);
      */
     
      fs.createReadStream(file.path).pipe(stream)
      .on('headers',function(headers) {
         headers.forEach(function(val) {
           map_headers[val] = 1;
         });
         schema.forEach(function(_schema) {
           var missing = false;
           _schema.fields.forEach(function(field) {
             if(!map_headers[field]) 
               missing = true;
           });
           if(!missing) working_type.push(_schema);
         });
      })
      .on('data',function(data) {
        working_type.forEach(function(_schema) {
          var tmp = {'type':_schema.type};
          _schema.fields.forEach(function(field) {
            tmp[field] = data[field]?data[field]:opts[field];
          });
          tmp['_id'] = 'csv_'+util.hash_row(tmp);
          docs.push(tmp);
        });
      })
      .on('end',function() {
        file.contents = new Buffer(JSON.stringify(docs));
        gutil.log('parsed ',file.path);
        self.push(file);
        callback();
      });
    }
  });
};
