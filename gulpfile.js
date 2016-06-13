'use strict'

const connect = require('gulp-connect');
const del = require('del')
const gulp = require('gulp')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')

const distributionPath = './dist'
const sourcePath = './src'

const allDistributionPath = `${distributionPath}/**/*`
const allSourcePath = `${sourcePath}/**/*`
const staticPath = [allSourcePath]

// CLEANERS

gulp.task('clean:all', () => del(allDistributionPath))


// COPIERS

gulp.task('static:copy', () => (
  gulp.src(allSourcePath)
    .pipe(gulp.dest(distributionPath))
))


// WATCHERS

gulp.task('watch', () => (
  runSequence(
    'clean:all',
    'build',
    [
      'static:watch',
      'livereload:watch',
      'connect'
    ]
  )
))

gulp.task('livereload:watch', () => (
  gulp.watch(allDistributionPath, ['livereload'])
))


gulp.task('static:watch', () => (
   gulp.watch(staticPath, ['build'])
))

// SERVERS

gulp.task('connect', () => connect.server({
  root: distributionPath,
  livereload: true
}))

gulp.task('livereload', () => (
  gulp.src(allDistributionPath)
    .pipe(connect.reload())
))

// BUILDERS

gulp.task('build', ['static:copy'])

gulp.task('dist', () => (
  runSequence(
    'clean:all',
    'build',
    'clean:temp'
  )
))
