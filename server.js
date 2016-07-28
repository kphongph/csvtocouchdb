var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(3000,function() {
  console.log("Example app listening at port 3000");
});

