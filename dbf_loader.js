var DBF = require('stream-dbf');
var iconv = require('iconv-lite');
var _ = require('lodash');
var fs = require('fs');

var file_name = 'b-stu1';

var target_dir = './population/'+file_name+'/src/';
var parser = new DBF('../dbf/'+file_name+'.dbf');
parser.header.fields.forEach(function(head) {
  head.raw = true;
});

var stream = parser.stream;

var write_csv_line = function(arr) {
  var quoted_array = arr.map(function(item) {
    return '\"' + item + '\"';
  });
  return quoted_array.toString() + '\n';
};

var count = 0;
var idx = 1;
var str = null;

stream.on('data',function(record) {
  for(var key in record) {
    if(record[key] instanceof Buffer ) {
      record[key] = iconv.decode(record[key],'cp874');
    }
  }
  record['sequenceNumber']=record['@sequenceNumber'];
  var blist = ['@sequenceNumber','@deleted','\r',''];
  blist.forEach(function(field) {
    delete record[field];
  });

  if(!str) {
    str = write_csv_line(_.keys(record));
    str += write_csv_line(_.values(record));
  } else {
    str += write_csv_line(_.values(record));
  }

  if(count == 2000) {
    count=0;
    console.log('creating',idx);
    fs.writeFileSync(target_dir+'file_'+idx+'.csv',str);
    idx++;
    str=null;
  } else {
    count++;
  }
});

stream.on('end',function() {
  console.log('creating',idx);
  fs.writeFileSync(target_dir+'file_'+idx+'.csv',str);
});
