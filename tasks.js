import gulp from 'gulp';
import gfile from 'gulp-file';
import del from 'del';
import React from 'react';
import Site from './src/components/Site';
import Page from './src/components/Page';
import renderComponentWithFile from './src/tasks/renderComponentWithFile';

const CONFIG = {
  DEST: {
    ROOT: 'dist/',
    PAGES: 'dist/pages/'
  }
};

gulp.task('clean', function runClean(cb) {
  del([CONFIG.DEST.ROOT], cb);
});

gulp.task('renderSite', function runRenderSite() {
  let rendered = React.renderToString(<Site />);

  return gfile('site.html', rendered, {src: true})
    .pipe(gulp.dest(CONFIG.DEST.ROOT));
});

gulp.task('renderPages', function runRenderPages() {
  return gulp.src('./pages/*.md')
    .pipe(renderComponentWithFile(Page))
    .pipe(gulp.dest(CONFIG.DEST.PAGES));
});

gulp.task('render', [
  'renderSite',
  'renderPages'
]);

gulp.task('default', ['clean'], function runDefault() {
  return gulp.start('render');
});
