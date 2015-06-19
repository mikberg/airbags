import gulp from 'gulp';
import gfile from 'gulp-file';
import del from 'del';
import gutil from 'gulp-util';
import React from 'react';
import through from 'through2';
import path from 'path';
import {assign} from 'lodash';

import Site from './src/components/Site';
import Page from './src/components/Page';

const CONFIG = {
  DEST: {
    ROOT: 'dist/',
    PAGES: 'dist/pages/'
  }
};

function renderPages(options) {
  function renderPage(Component, props, callback) {
    let rendered;

    try {
      rendered = React.renderToString(<Component {...props} />);
    } catch(e) {
      callback(e);
    }

    callback(null, rendered);
  }

  function defaultProps(file) {
    return {
      contents: file.contents.toString(),
      path: path.relative(__dirname, file.path)
    };
  }

  let defaultOptions = {
    props: defaultProps
  };

  let finalOptions = assign({}, defaultOptions, options);

  return through.obj(function inner(file, enc, cb) {
    let callback;
    let props = finalOptions.props(file);

    if (!finalOptions.component) {
      return cb(new gutil.PluginError('RenderPages',
        'component needs to be specified in options given'));
    }

    function filePush(rendered) {
      file.contents = new Buffer(rendered, enc);
      file.path = gutil.replaceExtension(file.path, '.html');

      cb(null, file);
    }

    callback = (err, rendered) => {
      if (err) {
        return cb(new gutil.PluginError('RenderPages', err));
      }
      filePush(rendered);
    };

    renderPage(Page, props, callback);
  });
}


gulp.task('clean', function runClean(cb) {
  del([CONFIG.DEST.ROOT], cb);
});

gulp.task('renderSite', function runRenderSite() {
  let rendered = React.renderToString(<Site />);

  return gfile('site.html', rendered, {src: true})
    .pipe(gulp.dest(CONFIG.DEST.ROOT));
});

gulp.task('renderPages', function runRenderPages() {
  let options = {
    component: Page,
    props: (file) => {
      return {
        contents: file.contents.toString(),
        path: path.relative(__dirname, file.path)
      };
    }
  };

  return gulp.src('./pages/*.md')
    .pipe(renderPages(options))
    .pipe(gulp.dest(CONFIG.DEST.PAGES));
});

gulp.task('render', [
  'renderSite',
  'renderPages'
]);

gulp.task('default', ['clean'], function runDefault() {
  return gulp.start('render');
});
