import gulp from 'gulp';
import gfile from 'gulp-file';
import del from 'del';
import React from 'react';

import App from './components/App';
import Site from '../src/components/Site';
import Home from './components/Home';
import Page from './components/Page';
import Router from 'react-router';

import addDoctype from '../src/tasks/addDoctype';
import renderRoutes from '../src/tasks/renderRoutes';

let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

const CONFIG = {
  DEST: {
    ROOT: 'dist/',
    PAGES: 'dist/pages/'
  }
};

let routes = (
  <Route handler={Site}>
    <DefaultRoute handler={Home} />
    <Route handler={Page} path="/pages/:pageId" />
  </Route>
);

gulp.task('clean', function runClean(cb) {
  del([CONFIG.DEST.ROOT], cb);
});

gulp.task('renderSite', function runRenderSite() {
  Router.run(routes, '/', (Root) => {
    let rendered = React.renderToString(<Root />);

    return gfile('site.html', rendered, {src: true})
      .pipe(addDoctype())
      .pipe(gulp.dest(CONFIG.DEST.ROOT));
  });
});

gulp.task('renderPages', function runRenderPages() {
  return gulp.src('pages/*.md')
    .pipe(renderRoutes(routes, Router, React))
    .pipe(addDoctype())
    .pipe(gulp.dest('dist/pages'));
});

gulp.task('render', [
  'renderSite',
  'renderPages'
]);

gulp.task('default', ['clean'], function runDefault() {
  return gulp.start('render');
});
