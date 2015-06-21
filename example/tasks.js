import gulp from 'gulp';
import gfile from 'gulp-file';
import del from 'del';

import CustomSite from './components/CustomSite';

import addDoctype from '../src/tasks/addDoctype';
import renderRoutes from '../src/tasks/renderRoutes';

const CONFIG = {
  DEST: {
    ROOT: 'dist/',
    PAGES: 'dist/pages/'
  }
};

gulp.task('clean', function runClean(cb) {
  del([CONFIG.DEST.ROOT], cb);
});

gulp.task('renderHome', function runRenderHome() {
  return gfile('index.html', '', {src: true})
    .pipe(renderRoutes(CustomSite))
    .pipe(addDoctype())
    .pipe(gulp.dest(CONFIG.DEST.ROOT));
});

gulp.task('renderPages', function runRenderPages() {
  return gulp.src('pages/*.md')
    .pipe(renderRoutes(CustomSite))
    .pipe(addDoctype())
    .pipe(gulp.dest('dist/pages'));
});

gulp.task('css', function runCss() {
  return gulp.src('*.css')
    .pipe(gulp.dest(CONFIG.DEST.ROOT));
});

gulp.task('render', [
  'renderHome',
  'renderPages',
  'css'
]);

gulp.task('default', ['clean'], function runDefault() {
  return gulp.start('render');
});
