var request = require('request');
var JSONStream = require('JSONStream');

var stream = request('http://10.27.65.55:5984/dmc/_design/dropout/_view/by_cid?stale=ok')
  .pipe(JSONStream.parse('rows.*'));

var count = 0;
var no_cid = 0;

var limit = 10000;
var processed = 0;
var current = null;

var stats = {
  'in_pop_not_bstu': 0,
  'in_pop_in_bstu': 0,
  'not_pop':0
};

var group_cid = function(data) {
  if(!current) {
    current = {
      'cid':data.key[0],
      'content':[data]
    };
    return;
  }
  if(current.cid == data.key[0]) {
    current.content.push(data);
  } else {
    processed++;
    dropout(current);
    // new cid
    current.cid = data.key[0];
    current.content = [data];
    limit--;
    console.log(processed);
    if(limit == 0) {
      console.log('Processed',processed);
      console.log(JSON.stringify(stats,null,2));
      process.exit();
    }
  }
};

var dropout = function(data) {
  var pop = false;
  var stu = false;
  var dmc = false;
  var dmc_record = '';
  data.content.forEach(function(record) {
    if(record.key[1]==0) pop=true;
    if(record.key[1]==1) stu=true;
    if(record.key[1]==2) { 
      dmc=true;
      dmc_record = record.key[2];
    }
  });
  if(pop&&!stu) stats['in_pop_not_bstu']++;
  if(pop&&stu) stats['in_pop_in_bstu']++;
  if(!pop) stats['not_pop']++;
};

stream.on('data',function(data) {
  group_cid(data);  
});


