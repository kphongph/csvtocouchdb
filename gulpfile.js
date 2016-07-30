var gulp = require('gulp');
var changed = require('gulp-changed');
var design = require('./gulp-plugins/couchdb-design');
var post = require('./gulp-plugins/couchdb-post');
var prettify = require('gulp-prettify');
var dmc_parser = require('./gulp-plugins/dmc-parser');
var md5check = require('./gulp-plugins/csvmd5-check');
var bulkinsert = require('./gulp-plugins/couchdb-bulkinsert');
var listStudent = require('./gulp-plugins/list-student');
var request = require('request');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var updateCurrentRecord = require('./gulp-plugins/update-current-record');

var dbUrl = 'http://192.168.1.103:5984/small';
var student_cid_dir='./output/cid';

gulp.task('dmc_255901',function() {
  gulp.src('csv/2559_01/*.csv')
    .pipe(changed('output/2559_01'))
    .pipe(dmc_parser({
      record_as:"2559/1"
    }))
    .pipe(md5check({dbUrl:dbUrl}))
    .pipe(bulkinsert('http://192.168.1.103:5984/small'))
    .pipe(gulp.dest('output/2558_01'));
});

gulp.task('dmc_255803',function() {
  gulp.src('csv/2558_03/*.csv')
    .pipe(changed('output/2558_03'))
    .pipe(dmc_parser({
      record_as:"2558/3"
    }))
    .pipe(md5check({
      dbUrl:"http://192.168.1.103:5984/small"
    }))
    .pipe(bulkinsert('http://192.168.1.103:5984/small'))
    .pipe(gulp.dest('output/2558_03'));
});

gulp.task('list_student',function() {
  var design = '/_design/student/_view/by_cid?group_level=1';
  var options = {
    url:'http://192.168.1.103:5984/small'+design
  }
  request(options)
  .pipe(source('student.json'))
  .pipe(streamify(listStudent()))
  .pipe(gulp.dest(student_cid_dir));
});

gulp.task('update_current_record',function() {
  gulp.src(student_cid_dir+'/src/*')
   .pipe(changed(student_cid_dir+'/dest'))
   .pipe(updateCurrentRecord(dbUrl))
    .pipe(gulp.dest(student_cid_dir+'/dest'));
});

gulp.task('default',function() {
  gulp.src(['design/**/*.js'])
    .pipe(changed('./output'))
    .pipe(design())
    .pipe(post('http://192.168.1.103:5984/small'))
    .pipe(gulp.dest('./output'));
});

