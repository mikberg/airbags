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

function generate(src) {
  return collect(src, markdownExtractor).then((siteMap) => {
    const context = createContext({
      siteMap: Object.assign({}, siteMap, {
        index: {
          nakedPath: 'index',
          originalPath: 'index.md',
          data: {
            meta: {
              title: 'Home',
              inMenu: true,
            },
          },
        },
      }),
    }, middleware);

    global.api = createApi(
      [createCacheStrategy(context)],
      middleware
    );

    return mergeStream(
      renderJson(global.api),
      createReactRenderer(renderPath)(global.api)
    );
  });
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

  apply(compiler) {
    const source = this.getSource(this.options);

    compiler.plugin('emit', (compilation, done) => {
      generate(source).then(stream => {
        stream
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
    });
  }
}
