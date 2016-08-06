var request = require('request');

var json = {
  source:'http://192.168.1.103:5984/small',
  target:'http://192.168.1.101:5984/dmc_backup',
  doc_ids:['00050ec555d93d20d95d96116c01cfb1']
};

var options = {
  url:'http://192.168.1.103:5984/_replicate',
  method:'POST',
  json:true,
  body:json
};

request(options,function(err,response,body) {
  if(err) {
    console.log('Error');
    console.log(err);
  }
  if(body) {
    console.log(body);
  }
});
