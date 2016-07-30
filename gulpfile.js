var gulp = require('gulp');
var changed = require('gulp-changed');
var design = require('./gulp-plugins/couchdb-design');
var post = require('./gulp-plugins/couchdb-post');
var prettify = require('gulp-prettify');

gulp.task('default',function() {
  gulp.src(['design/**/*.js'])
    .pipe(changed('./output'))
    .pipe(design())
    .pipe(post('http://192.168.1.103:5984/small'))
    .pipe(gulp.dest('./output'));
});

/*
gulp.task('prettify', function() {
  gulp.src('public/elements/**/*.html')
    .pipe(prettify({indent_size:2}))
    .pipe(gulp.dest('dist'))
});
*/
