import mergeStream from 'merge-stream';
import vinylFs from 'vinyl-fs';
import collect from '../src/collect';
import markdownExtractor from '../src/extractors/markdown';
import { createContext } from '../src/context';
import menu from '../src/middleware/menu';
import createConfig from '../src/middleware/config';
import renderJson from '../src/render/json';
import { createReactRenderer } from '../src/render/react';

import createApi from '../src/api';
import createCacheStrategy from '../src/api/cache';

import renderPath from './renderPath';

const middleware = [
  menu,
  createConfig({ siteName: 'Airbags Docs '}),
];

function generate(siteMap) {
  const context = createContext({ siteMap }, middleware);

  global.api = createApi(
    [createCacheStrategy(context)],
    middleware
  );

  return mergeStream(
    renderJson(global.api),
    createReactRenderer(renderPath)(global.api)
  );
}

export default class AirbagsPlugin {
  constructor(options) {
    this.options = options;
  }

  getSource(options) {
    const sourceFiles = options.sourceFiles || [];
    // TODO: Replace process.cwd with something from webpack?
    return vinylFs.src(sourceFiles, { base: process.cwd() });
  }

  getExtractor(options) {
    return options.extractor || markdownExtractor;
  }

  getAdditionalPages(options) {
    const additional = options.additionalPages || {};
    const siteMap = {};

    Object.keys(additional).forEach((nakedPath) => {
      const data = additional[nakedPath];
      siteMap[nakedPath] = {
        nakedPath,
        originalPath: `${nakedPath}.html`,
        data,
      };
    });

    return siteMap;
  }

  emit(compilation, done) {
    const source = this.getSource(this.options);
    const extractor = this.getExtractor(this.options);

    collect(source, extractor).then(siteMap => {
      Object.assign(siteMap, this.getAdditionalPages(this.options));

      generate(siteMap)
      .on('data', (file) => {
        compilation.assets[file.path] = {
          source: () => file.contents.toString(),
          size: () => file.contents.toString().length,
        };
      })
      .on('error', error => done(error))
      .on('end', () => {
        done();
      });
    });
  }

  apply(compiler) {
    compiler.plugin('emit', this.emit.bind(this));
  }
}
