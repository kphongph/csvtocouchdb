var request = require('request');
var through = require('through2');
var gutil = require('gulp-util');
var csv = require('csv-parser');
var util = require('./util');
var fs = require('fs');

var schema = [
  {
    type:'bstudent_info',
    fields:[
      "COLUMN1","COLUMN2","COLUMN3","COLUMN4","SUNGKUD","YEAR_ED",
      "TERM","MOE_CODE","S_NAME","ST_NO","IDCODE","SUR_CODE",
      "SUR_NAME","NAME1","NAME2","N1_ENG","N2_ENG","MDYYYY",
      "SEX","COLUMN20","RACE_CODE","COLUMN22","COLUMN23",
      "COLUMN24","HOUSE_NO","COLUMN26","COLUMN27","COLUMN28",
      "COLUMN29","COLUMN30","TB_CODE","COLUMN32","COLUMN33",
      "COLUMN34","P_DOLA","COLUMN36","COLUMN37","COLUMN38","COLUMN39",
      "COLUMN40","COLUMN41","COLUMN42","COLUMN43","COLUMN44","COLUMN45",
      "COLUMN46","COLUMN47","COLUMN48","COLUMN49","COLUMN50","COLUMN51",
      "COLUMN52","COLUMN53","COLUMN54","COLUMN55","COLUMN56","COLUMN57",
      "COLUMN58","COLUMN59","COLUMN60","COLUMN61","COLUMN62","COLUMN63",
      "COLUMN64","COLUMN65","COLUMN66","COLUMN67","COLUMN68","COLUMN69",
      "COLUMN70","COLUMN71","CLASS","COLUMN73","COLUMN74","COLUMN75",
      "COLUMN76","COLUMN77","LEVEL","COLUMN79","COLUMN80","COLUMN81",
      "COLUMN82","sequenceNumber"
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
        var doc = {'docs':docs};
        file.contents = new Buffer(JSON.stringify(doc));
        gutil.log('parsed ',file.path);
        self.push(file);
        callback(null);
      });
    }
  });
};
