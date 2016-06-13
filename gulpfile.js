'use strict'

const connect = require('gulp-connect');
const del = require('del')
const gulp = require('gulp')
const runSequence = require('run-sequence')
// const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

const distributionPath = './dist'
// const sassRelativePath = '/styles'
const sourcePath = './src'

const allDistributionPath = `${distributionPath}/**/*`
// const allSassPath = `${sourcePath}${sassRelativePath}/**/*.scss`
const allSourcePath = `${sourcePath}/**/*`
// const sassEntryPath = `${sourcePath}${sassRelativePath}/main.scss`
const staticPath = [allSourcePath]

// CLEANERS

gulp.task('clean:all', () => del(allDistributionPath))

// gulp.task('clean:temp', () => del(`${distributionPath}${sassRelativePath}`))

// COPIERS

gulp.task('static:copy', () => (
  gulp.src(allSourcePath)
    .pipe(gulp.dest(distributionPath))
))

// COMPILERS

// gulp.task('sass:compile', () => (
//   gulp.src(sassEntryPath)
//     .pipe(sourcemaps.init())
//     .pipe(sass()
//       .on('error', sass.logError)
//     )
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest(`${distributionPath}/css`))
// ))

// WATCHERS

gulp.task('watch', () => (
  runSequence(
    'clean:all',
    'build',
    [
      'static:watch',
      // 'sass:watch',
      'livereload:watch',
      'connect'
    ]
  )
))

gulp.task('livereload:watch', () => (
  gulp.watch(allDistributionPath, ['livereload'])
))

// gulp.task('sass:watch', () => (
//   gulp.watch(allSassPath, ['sass:compile'])
// ))

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
