'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var coffee = require('gulp-coffee');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var utils = require('./utils');

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');
var gameCoffeeDir = jetpack.cwd()+'/src/rot-game/coffee/'
var gameJsDir = jetpack.cwd()+'/src/rot-game/js/'
var gameJsFiles = jetpack.list(gameJsDir)


gulp.task('coffee', function() {
    gulp.src(gameCoffeeDir+'*.coffee')
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(gulp.dest(gameJsDir));

    // delete coffeeless js files
    for (var i = 0, len = gameJsFiles.length; i < len; i++) {
        var fileToken = gameJsFiles[i]
            .replace(gameJsDir, '')
            .replace('.js', '')

        var filePath = gameJsDir+fileToken+'.js'

        if(!(jetpack.exists(gameCoffeeDir+fileToken+'.coffee'))) {
          console.log('~~~ removing: ', filePath)
          jetpack.remove(filePath);
        };
    };

});

gulp.task('bundle', function () {
    return Promise.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js')),
    ]);
});

gulp.task('less', function () {
    return gulp.src(srcDir.path('stylesheets/main.less'))
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir.path('stylesheets')));
});

gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', function () {
    var beepOnError = function (done) {
        return function (err) {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };

    watch('src/**/*.coffee', batch(function (events, done) {
        gulp.start('coffee', beepOnError(done));
    }));
    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('src/**/*.less', batch(function (events, done) {
        gulp.start('less', beepOnError(done));
    }));
});

gulp.task('build', ['coffee', 'bundle', 'less', 'environment']);
