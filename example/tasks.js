import gulp from 'gulp';
import gfile from 'gulp-file';
import del from 'del';
import React from 'react';

import Site from '../src/components/Site';

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

// gulp.task('renderSite', function runRenderSite() {
//   Router.run(routes, '/', (Root) => {
//     let rendered = React.renderToString(<Root />);
//
//     return gfile('site.html', rendered, {src: true})
//       .pipe(addDoctype())
//       .pipe(gulp.dest(CONFIG.DEST.ROOT));
//   });
// });

gulp.task('renderHome', function runRenderHome() {
  return gfile('index.html', '', {src: true})
    .pipe(renderRoutes(Site))
    .pipe(addDoctype())
    .pipe(gulp.dest(CONFIG.DEST.ROOT));
});

gulp.task('renderPages', function runRenderPages() {
  return gulp.src('pages/*.md')
    .pipe(renderRoutes(Site))
    .pipe(addDoctype())
    .pipe(gulp.dest('dist/pages'));
});

gulp.task('render', [
  'renderHome',
  'renderPages'
]);

gulp.task('default', ['clean'], function runDefault() {
  return gulp.start('render');
});
