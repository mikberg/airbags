import through from 'through2';
import gutil from 'gulp-util';
import {isArray} from 'lodash';
import {manifestFragmentFromFile} from '../utils/content';

export default function addToManifest(manifest, property) {
  return through.obj((file, enc, cb) => {
    if (typeof manifest !== 'object') {
      return cb(new gutil.PluginError('addToManifest',
        'manifest must be object'));
    }

    if (!isArray(manifest[property])) {
      return cb(new gutil.PluginError('addToManifest',
        `manifest.${property} must be array`));
    }

    manifestFragmentFromFile(file, enc, (err, fileManifest) => {
      if (err) {
        return cb(new gutil.PluginError('addToManifest', err));
      }

      manifest[property].push(fileManifest);
      cb(null, file);
    });
  });
}

addToManifest.page = function page(manifest) {
  return addToManifest(manifest, 'pages');
};
