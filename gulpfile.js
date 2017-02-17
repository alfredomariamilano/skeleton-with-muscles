const gulp     	       = require('gulp');
const babel    	       = require('gulp-babel');
const cleanCSS 	       = require('gulp-clean-css');
const stripCssComments = require('gulp-strip-css-comments');
const sass 	   	       = require('gulp-sass');
const autoprefixer     = require('gulp-autoprefixer');
const livereload       = require('gulp-livereload');
const filter           = require('gulp-filter');
const flatten          = require('gulp-flatten');
const concat           = require('gulp-concat');
const order            = require('gulp-order');
const wait             = require('gulp-wait');
const del              = require('del');
const nodemon          = require('gulp-nodemon');
const plumber          = require('gulp-plumber');

const src  = 'src';
const dist = 'public';

// sass
gulp.task('sass', () => {
  return gulp.src(`${src}/scss/style.scss`)
  .pipe(sass(sass()).on('error', sass.logError))
  // .pipe(stripCssComments())
  // .pipe(cleanCSS({ compatibility: 'ie8'}))
  // .pipe(flatten())
  .pipe(autoprefixer())
  .pipe(gulp.dest(`${dist}/css`))
  .pipe(livereload());
});

// scripts & es6
gulp.task('scripts', () => {
  return gulp.src(`${src}/**/*.js`)
  .pipe(plumber())
  .pipe(babel({
    presets: ['es2015'],
    compact: true,
    ignore: [
      '_bower.js'
    ]
  }))
  .pipe(flatten())
  .pipe(order([
    'app.js',
    '**/*.js'
  ]))
  .pipe(concat('app.js'))
  // .pipe(uglify())
  .pipe(gulp.dest(`${dist}/js`))
  .pipe(wait(1500))
  .pipe(livereload());
});

gulp.task('copy', [
  'copy:fonts',
  'copy:images',
  'copy:views'
]);

// copy fonts from src to dist
gulp.task('copy:fonts', () => {
  return gulp.src(`${src}/**/*.{eot,svg,ttf,woff,woff2}`)
  .pipe(gulp.dest(dist));
});
// copy images from src to dist
gulp.task('copy:images', () => {
  return gulp.src(`${src}/**/*.{png,gif,jpg,ico,jpeg}`)
  .pipe(gulp.dest(dist));
});
// copy html from src to dist
gulp.task('copy:views', () => {
  return gulp.src(`${src}/**/*.html`)
  .pipe(plumber())
  .pipe(gulp.dest(dist))
  .pipe(livereload());
});

// clean public
gulp.task('clean:public', () => {
  return del(['public/*'], {dot: true});
});

gulp.task('html', () => {
  return gulp.src('./index.html')
  .pipe(livereload());
});

// watch changes
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('./index.html', ['html']);
  gulp.watch(`${src}/**/*.html`, ['copy:views']);
  gulp.watch(`${src}/**/*.js`, ['scripts']);
  gulp.watch(`${src}/**/*.scss`, ['sass']);
});

gulp.task('default', [
  'clean:public',
  'sass',
  'copy',
  'scripts',
  'watch'
]);
