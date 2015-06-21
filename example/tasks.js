import gulp from 'gulp';
import gfile from 'gulp-file';
import del from 'del';
import React from 'react';

import App from './components/App';
import Home from './components/Home';
import Router from 'react-router';

import addDoctype from '../src/tasks/addDoctype';

let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

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
  let routes = (
    <Route handler={App}>
      <DefaultRoute handler={Home} />
    </Route>
  );

  Router.run(routes, '/', (Root) => {
    let rendered = React.renderToString(<Root />);

    return gfile('site.html', rendered, {src: true})
      .pipe(addDoctype())
      .pipe(gulp.dest(CONFIG.DEST.ROOT));
  });
});

gulp.task('render', [
  'renderSite'
]);

gulp.task('default', ['clean'], function runDefault() {
  return gulp.start('render');
});
