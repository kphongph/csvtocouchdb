var request = require('request');
var JSONStream = require('JSONStream');

var query_url = 'http://10.27.65.55:5984/dmc/_design/dropout/_view/by_cid?stale=ok';

var chunks = [
 //  {'startkey':'0000000000000','endkey':'0999999999999'},
];

for(var i=10;i<100;i++) {
  var tmp = {'startkey':'1'+i+'0000000000','endkey':'1'+i+'9999999999'};
  chunks.push(tmp);
}

var retrieve = function(region,cb) {
  var url = query_url+'&startkey=["'+region.startkey+'"]'; 
  url += '&endkey=["'+region.endkey+'"]'; 
  var stream = request(url).pipe(JSONStream.parse('rows.*'));

  var stats = {
    'docs':0,
    'region':region.startkey+'-'+region.endkey,
    'info': {
      'in_pop_not_bstu': 0,
      'in_pop_in_bstu': 0,
      'in_dmc':0,
      'in_pop_not_current_dmc_not_bstu':0,
      'not_pop':0
     }
  };

  var current = null;

  stream.on('data',function(data) {
    if(!current) {
      current = {
        'cid':data.key[0],
        'content':[data]
      };
    } else {
      stats.docs++;
      if(current.cid == data.key[0]) {
        current.content.push(data);
      } else {
        dropout(current,stats);
        current.cid = data.key[0];
        current.content = [data];
      }
    }
 });

 stream.on('end',function() {
  cb(stats);
 });

};

var dropout = function(data,stats) {
  var pop = false;
  var stu = false;
  var dmc = false;
  var current_dmc = '2559/1';
  var in_current_dmc = false;
  
  data.content.forEach(function(record) {
    if(record.key[1]==0) pop=true;
    if(record.key[1]==1) stu=true;
    if(record.key[1]==2) { 
      dmc=true;
      if(current_dmc != record.key[2]) {
        in_current_dmc = true;
      }
    }
  });
  if(pop&&!stu) stats.info['in_pop_not_bstu']++;
  if(pop&&stu) stats.info['in_pop_in_bstu']++;
  if(!pop) stats.info['not_pop']++;
  if(dmc) stats.info['in_dmc']++;
  if(pop&&!in_current_dmc&&dmc&&!stu) {
    stats['in_pop_not_current_dmc_not_bstu']++;
  }
};

var count = 0;
var report = {};

chunks.forEach(function(chunk) {
  retrieve(chunk,function(stats) {
    console.log(stats.region,stats.docs);
    for(var key in stats.info) {
      if(!report[key]) report[key] = 0;
      report[key]+=stats.info[key];
    }
    count++;
    if(count == chunks.length) {
      console.log(JSON.stringify(report,null,2));
    }
  });
});
