import {chain} from 'lodash';

let fs;
let path;

if (!process.browser) {
  fs = require('fs');
  path = require('path');
}

export function stripExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

function getUrlsServer(dir) {
  return chain(fs.readdirSync(dir))
    .map((filename) => {
      return {
        path: path.join(dir, filename)
      };
    })
    .map((obj) => {
      obj.path = '/' + stripExtension(obj.path) + '.html';
      return obj;
    })
    .indexBy('path')
    .value();
}

function getUrlsBrowser() {
  throw new Error('Not yet implemented for browsers');
}

export function getUrls(dir) {
  let locations;

  if (process.browser) {
    locations = getUrlsBrowser(dir);
  } else {
    locations = getUrlsServer(dir);
  }

  return locations;
}
