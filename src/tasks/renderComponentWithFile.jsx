import gutil from 'gulp-util';
import through from 'through2';
import {assign} from 'lodash';
import path from 'path';
import React from 'react';

/**
 * Render some react component while giving it a vinyl file, plus any other
 * properties, as `props`. Can be used, for instance, to use markdown files to
 * statically render a component to HTML.
 * @param  {fn<Component>} component The React component to render
 * @param  {object} options Default options:
 *                            props: (file) => {
 *                            	contents: file.contents.toString(),
 *                            	path: path.relative(__dirname, file.path)
 *                            }
 * @return {stream}         Stream of rendered HTML files
 */
export default function renderComponentWithFile(Component, options) {
  function renderPage(props, callback) {
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

    renderPage(props, callback);
  });
}
