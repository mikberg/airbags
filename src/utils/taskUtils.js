import path from 'path';
import React from 'react';

export function locationFromPath(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\.[^/.]+$/, '');
}

export function fileManifestFromFile(file, enc, cb) {
  let fileManifest = {
    path: locationFromPath(file.path) + '.html'
  };

  cb(null, fileManifest);
}

export function renderComponentWithProps(Component, props) {
  return React.renderToString(<Component {...props} />);
}
