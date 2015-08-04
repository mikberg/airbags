import through from 'through2';
import React from 'react';
import gutil from 'gulp-util';
import {cache} from './cache';
import cacheApi from '../apis/cacheApi';
import {changeExtension, relativePath} from '../utils/taskUtils';

export default function renderWithReactComponent(Component) {
  function render(sourceFile, enc, cb) {
    let relPath = relativePath(sourceFile.path);

    let renderedFile = new gutil.File({
      base: sourceFile.base,
      cwd: sourceFile.cwd,
      path: changeExtension(sourceFile.path, '.html')
    });

    if (cache[relPath]) {
      cache[relPath].renderedPath = relativePath(renderedFile.path);
    }

    let props = {
      path: relPath,
      airbagsApi: cacheApi
    };

    let rendered = React.renderToString(
      <Component {...props} />
    );

    renderedFile.contents = new Buffer(rendered, enc);

    gutil.log(`Airbags rendered '${relativePath(sourceFile.path)}'`);

    this.push(renderedFile);
    this.push(sourceFile);

    cb();
  }

  return through.obj(render);
}
