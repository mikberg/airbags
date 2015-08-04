import path from 'path';
import through from 'through2';
import gutil from 'gulp-util';
import {map} from 'lodash';
import yamlFront from 'yaml-front-matter';
import React from 'react';
import addDoctype from './addDoctype';

let cache = {};
let contentCache = {};

function relativePath(filePath) {
  return path.relative(process.cwd(), filePath);
}

function changeExtension(filePath, toExtension) {
  return filePath.replace(/\.[^/.]+$/, toExtension);
}

let airbagsCacheApi = {
  getFrontMatter: (url) => {
    return cache[url];
  },

  getContents: (url) => {
    return contentCache[url];
  },

  getPages: () => {
    return map(cache, (p) => p);
  }
};

export default function airbags() {
  function register(file, enc, cb) {
    let relPath = relativePath(file.path);

    let frontMatter = yamlFront.loadFront(file.contents);
    let contents = frontMatter.__content;
    delete frontMatter.__content;

    cache[relPath] = frontMatter;
    contentCache[relPath] = contents;

    file.contents = new Buffer(contents, enc);

    gutil.log(`Airbags registered '${frontMatter.title || file.path}'`);

    this.push(file);
    cb();
  }

  return through.obj(register);
}

airbags.renderWithReactComponent = function renderWithReactComponent(Component) {
  function render(sourceFile, enc, cb) {
    let relPath = relativePath(sourceFile.path);
    let fromCache = cache[relPath];

    if (!fromCache) {
      return cb(new gutil.PluginError('airbags',
        `Couldn't find ${sourceFile.path} in cache`));
    }

    let renderedFile = new gutil.File({
      base: sourceFile.base,
      cwd: sourceFile.cwd,
      path: changeExtension(sourceFile.path, '.html')
    });

    let props = {
      path: relPath,
      airbagsApi: airbagsCacheApi
    };

    let rendered = React.renderToString(
      <Component {...props} />
    );

    renderedFile.contents = new Buffer(rendered, enc);

    gutil.log(`Airbags rendered '${fromCache.title || sourceFile.path}'`);

    this.push(renderedFile);
    this.push(sourceFile);

    cb();
  }

  return through.obj(render);
};

airbags.addDoctype = addDoctype;
