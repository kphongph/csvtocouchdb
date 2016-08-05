var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var gulp = require('gulp');
var respond = require('gulp-respond');
var through2 = require('through2');
var fs = require('fs');
var config = require('./config.js');
var dmc_parser = require('./gulp-plugins/dmc-parser');
var pop_parser = require('./gulp-plugins/pop-parser');

var app = express();

var jsonParser = bodyParser.json()

app.use(express.static(path.join(__dirname, 'public')));

var waiting_file = [];

var layout_file = [
  {
    'name':'dmc',
    'src':'./csv/school/src',
    'dest':'./csv/school/loaded',
    'parser':'dmc'
  },
  {
    'name':'pop',
    'src':'./population/A_Pop_T3/src',
    'dest':'./population/A_Pop_T3/dest',
    'parser':'pop'
  },
];

var limit = 50;
var sequence = 0;

var list_waiting = function(cb) {
  var waiting = [];
  if(sequence==layout_file.length) sequence=0;
  var layout = layout_file[sequence++];
  fs.readdir(layout.src,function(err,files) {
   if(err) { 
     throw err;
   } else {
     fs.readdir(layout.dest,function(err,loaded) {
       var count = 0;
       for(var i=0;i<files.length;i++) {
         if(loaded.indexOf(files[i])==-1) {
           waiting.push({
             'layout':layout,
             'file':files[i]
           });
           count++;
           if(count==limit) break;
         }
       }
       cb(waiting);
     });
   }
  });
}

var file_info = function(layout) {
  return through2.obj(function(data,encoding,callback) {
    var json = JSON.parse(data.contents);   
    var obj = {'layout':layout,'rows':json};
    data.contents = new Buffer(JSON.stringify(obj));
    this.push(data);
    callback();
  });
}
  

var get_file = function(list,res) {
  var obj = list.pop();
  var src_file = path.join(obj.layout.src,obj.file);
  var stream = gulp.src(src_file);
  var parser = null;
  if(obj.layout.name == 'dmc') {
    parser = dmc_parser();
  }

  if(obj.layout.name == 'pop') {
    parser = pop_parser();
  }

  gulp.src(src_file)
   .pipe(parser)
   .pipe(file_info(obj))
   .pipe(respond(res));
}

app.post('/dmc/save_file',jsonParser,function(req,res) {
  var layout = req.body.layout;
  var file = req.body.file;
  console.log(JSON.stringify(layout,null,2));
  if(layout) {
    var filepath = path.join(layout.dest,file);
    fs.open(filepath, "wx", function (err, fd) {
      fs.close(fd, function (err) {
        if(err) {
          res.json({'ok':false});
        } else {
          console.log(file,'saved');
          res.json({'ok':true});
        }
      });
    });
  }
});

app.get('/dmc/get_file',function(req,res) {
  if(waiting_file.length>15) {
    get_file(waiting_file,res);
  } else {
    list_waiting(function(waiting) {
      waiting_file.push.apply(waiting_file,waiting);
      get_file(waiting_file,res);
    });
  }
});


var server = app.listen(3000,function() {
  console.log("Example app listening at port 3000");
});

