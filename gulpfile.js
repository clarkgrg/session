/* globals -mocha */
'use strict';

const gulp = require('gulp');
const guppy = require('git-guppy')(gulp);
const runSequence = require('run-sequence');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');
const stylish_lint_reporter = require('jshint-stylish');
const env = require('gulp-env');
const nconf = require('nconf');
const config = require('./config/test').config();

nconf.argv({
  f: {
    alias: 'function',
    describe: 'Function name',
    demand: false,
    default : ''
  }
});

gulp.task('test', function() {
    const envs = env.set({
        STAGE: 'test',
        USERS_TABLE: config.UsersTable,
        REFRESH_TOKEN_TABLE: config.RefreshTokenTable,
        ACCESS_TOKEN_EXPIRATION: config.AccessTokenExpiration,
        REFRESH_TOKEN_EXPIRATION: config.RefreshTokenExpiration,
        LOG_LEVEL: config.LogLevel,
        API_ID_SALT: config.ApiIdSalt,
        PASSWORD_SALT: config.PasswordSalt
    });
    
    const target = `lambda_functions/${nconf.get('f') ? nconf.get('f') + '/' : ''}**/*.test.js`;

    return gulp.src( [ target, 'lib/**/*.test.js'], { read : false } )
        .pipe(envs)
        .pipe(mocha({ timeout: 5000 }));
});

gulp.task('lint', function() {

  const target = `lambda_functions/${nconf.get('f') ? nconf.get('f') + '/' : ''}**/*.js`;

  return gulp.src([
  	'./handler.js',
    target,
    './lib/**/*.js',
    './gulpfile.js',
    './test/**/*.js',
    'package.json',
    './config/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish_lint_reporter))
    .pipe(jshint.reporter('gulp-jshint-html-reporter', {
      filename: __dirname + '/jshint.html',
      createMissingFolders : false  
    }))
    .pipe(jshint.reporter('fail'));
});

/* git-hook tasks - Search "guppy-hook" on npm to find all guppy-hook packages. */
//dependant on guppy-pre-commit package
gulp.task('pre-commit', function() {
  return runSequence('test', 'lint');
});
