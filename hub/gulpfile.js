var gulp = require('gulp');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var bro = require('gulp-bro');
var changed = require('gulp-changed');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var babelify = require('babelify');

var webSRC = 'src';
var webDIST = 'dist';

gulp.task('clean', () => {
  return gulp.src('./' + webDIST + '/', { read: false })
    .pipe(clean());
});


/** ******************************* **/
/**            [web]:dev            **/
/** ******************************* **/

gulp.task('serve[web]:dev', () => {
  browserSync({
    notify: true,
    port: 1337,
    server: {
      baseDir: './' + webDIST + '/',
      index: "index.html"
    }
  });
});

gulp.task('watch[web]:dev', () => {
  gulp.watch(webSRC + '/**/*.html', { cwd: './' }, ['html[web]:dev']);
  gulp.watch(webSRC + '/js/**', { cwd: './' }, ['js[web]:dev']);
  gulp.watch(webSRC + '/scss/**', { cwd: './' }, ['sass[web]:dev']);
  gulp.watch(webSRC + '/static/**', { cwd: './' }, ['static[web]:dev']);
});

gulp.task('html[web]:dev', () => {
  return gulp.src('./' + webSRC + '/**/*.html')
    .pipe(gulp.dest('./' + webDIST  + '/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('js[web]:dev', () => {
  return gulp.src(['./' + webSRC + '/js/main.js'])
    .pipe(bro({
      transform: [
        babelify.configure({
          presets: ['es2015']
        })
      ],
      debug: true
    }))
    .pipe(gulp.dest('./' + webDIST + '/js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('sass[web]:dev', () => {
  return gulp.src('./' + webSRC + '/scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write({ includeContent: false }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./' + webDIST + '/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('static[web]:dev', () => {
  return gulp.src('./' + webSRC + '/static/**')
    .pipe(changed('./' + webDIST + '/static/'))
    .pipe(gulp.dest('./' + webDIST + '/static/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('[web]:dev', () => {
  runSequence(
    ['clean'],
    ['html[web]:dev', 'js[web]:dev', 'sass[web]:dev', 'static[web]:dev'],
    ['serve[web]:dev'],
    ['watch[web]:dev']
  );
});


/** ****************************** **/
/**           PRODUCTION           **/
/** ****************************** **/

gulp.task('html[web]:prod', () => {
  return gulp.src('./' + webSRC  + '/**/*.html')
    .pipe(gulp.dest('./' + webDIST  + '/'))
});

gulp.task('scripts[web]:prod', () => {
  return gulp.src(['./' + webSRC + '/js/main.js'])
    .pipe(bro({
      transform: [
        babelify.configure({
          presets: ['es2015']
        }),
        [ 'uglifyify', { global: true } ]
      ],
      debug: false
    }))
    .pipe(gulp.dest('./' + webDIST + '/js/'));
});

gulp.task('sass[web]:prod', () => {
  return gulp.src('./' + webSRC + '/scss/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./' + webDIST + '/css'));
});

gulp.task('static[web]:prod', () => {
  return gulp.src('./' + webSRC + '/static/**')
    .pipe(gulp.dest('./' + webDIST + '/static/'));
});

gulp.task('[web]:prod', () => {
  runSequence(
    ['clean'],
    ['html[web]:prod', 'scripts[web]:prod', 'sass[web]:prod', 'static[web]:prod']
  );
});


/** ******************************* **/
/**            Utilities            **/
/** ******************************* **/

const clearconsole = function() {
  process.stdout.write('\x1Bc');
};