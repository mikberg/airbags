import path from 'path';
import React from 'react';

export function renderComponentWithProps(Component, props) {
  return React.renderToString(<Component {...props} />);
}

export function changeExtension(filePath, toExtension) {
  return filePath.replace(/\.[^/.]+$/, toExtension);
}

export function relativePath(filePath) {
  return path.relative(process.cwd(), filePath);
}
