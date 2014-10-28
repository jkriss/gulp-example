var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var build = require('gulp-build');
var fs = require('fs');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var inlinesource = require('gulp-inline-source');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');

gulp.task('watch', function() {

  // these all trigger buildPages because we're inlining everything
  gulp.watch('pages/*.html', ['buildPages']);
  gulp.watch('styles/*.scss', ['buildPages']);
  gulp.watch('templates/*.html', ['buildPages']);
  gulp.watch('src/*.js', ['buildPages']);

});

gulp.task('scripts', function() {
    // Single entry point to browserify
    return gulp.src('src/index.js')
        .pipe(browserify({
          // transform: ['cssify'],
          // insertGlobals : true,
          nobuiltins: 'buffer',
          debug : false
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('./dist-scripts'))
});

gulp.task('sass', function () {
    gulp.src('styles/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

gulp.task('buildPages', ['scripts', 'sass'], function() {
  var options = {
      layout: fs.readFileSync('templates/default.html').toString()
  };
  gulp.src('pages/*.html')
      .pipe(build({ additionalMessage: 'Hi hi hi.' }, options))
      .pipe(inlinesource({
        swallowErrors : false
      }))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist'))
});


gulp.task('build', ['buildPages']);


module.exports = gulp;