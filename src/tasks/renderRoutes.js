import gutil from 'gulp-util';
import through from 'through2';
import React from 'react';
import path from 'path';

export default function renderRoutes(Site) {
  function renderRoute(location, callback) {
    let rendered = React.renderToString(<Site path={location} />);
    callback(null, rendered);
  }

  function locationFromPath(filePath) {
    return '/' +
      path.relative(process.cwd(), filePath).replace(/\.[^/.]+$/, '');
  }

  return through.obj((file, enc, cb) => {
    let location = locationFromPath(file.path);

    function filePush(rendered) {
      file.contents = new Buffer(rendered, enc);
      file.path = gutil.replaceExtension(file.path, '.html');

      cb(null, file);
    }

    function callback(err, rendered) {
      if (err) {
        return cb(new gutil.PluginError('RenderRoutes', err));
      }
      filePush(rendered);
    }

    renderRoute(location, callback);
  });
}
