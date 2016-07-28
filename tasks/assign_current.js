var config = require('../config.js');
var pouchdb = require('pouchdb');

var db = new pouchdb(config.couchdb.url+'/'+config.couchdb.db);

var current = null;
var batch_size = 100;

var retrieve = function(offset) {
  var buffer = [];
  var list = [];
  db.query('student/study_records', {
    limit:batch_size,
    skip:offset,
    include_docs:true
  },function(err,res) {
    if(err) {
      console.log(err);
    } else {
      if(!current) current = res.rows[0];
      res.rows.forEach(function(record) {
        if(current.key[0] != record.key[0]) {  
          if(!current.key[2]) {
            buffer.push(current.doc);
          }
        } else { 
          if(current.key[2] && !record.key[2]) { 
            buffer.push(current.doc);
          }
        }
        current = record;
      });
    }
    prepare(buffer,function() {
      var skip = offset+batch_size;
      if(skip<res.total_rows) {
        console.log(''+skip+'/'+res.total_rows);
        retrieve(skip);
      }
    });
  });
};

var prepare = function(buffer,cb) {
  if(buffer.length==0) { 
    cb();
  } else {
    buffer.forEach(function(doc) {
      if(doc.current) {
        delete doc['current'];
      } else {
        doc['current']='Y';
      }
    });
     
    db.bulkDocs(buffer,function(err,doc) {
      if(!err) cb();
      else console.log(err);
    });
  }
};

retrieve(0);
