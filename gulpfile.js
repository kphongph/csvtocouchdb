var gulp = require('gulp');
var changed = require('gulp-changed');
var design = require('./gulp-plugins/couchdb-design');
var post = require('./gulp-plugins/couchdb-post');

gulp.task('default',function() {
  gulp.src(['design/**/*.js'])
    .pipe(changed('./output'))
    .pipe(design())
    .pipe(post('http://192.168.1.103:5984/small'))
    .pipe(gulp.dest('./output'));
});
