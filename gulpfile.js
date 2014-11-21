var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var argv = require('yargs').argv;

gulp.task('develop', function () {
  livereload.listen();

  var options = {
    script: 'bin/www',
    ext: 'js html css json',
  }

  if (argv.local) {
    console.log('setting Node env to "local"')
    options.env = { 
      'NODE_ENV' : 'local', 
      'GH_USERNAME' : argv.user || 'timdose' 
    };
  }

  nodemon(options).on('restart', function () {
    setTimeout(function () {
      livereload.changed();
    }, 500);
  });
});

gulp.task('serve', ['develop']);
