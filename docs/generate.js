/* eslint no-console: 0 */
import vinylFs from 'vinyl-fs';
import collect from '../src/collect';
import markdownExtractor from '../src/extractors/markdown';
import {createContext} from '../src/context/';
import menuMiddleware from '../src/middleware/menuMiddleware';
import renderJson from '../src/render/json';
import renderPath from './renderPath';
import {createReactRenderer} from '../src/render/react';

import createApi from '../src/api';
import createCacheStrategy from '../src/api/cache';

const outFolder = './build/';
const middleware = [menuMiddleware];

collect(vinylFs.src(['./pages/*.md'], { base: process.cwd() }), markdownExtractor).then((siteMap) => {
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
    configuration: {
      siteName: 'Airbags Docs',
    },
  }, middleware);

  global.api = createApi(
    context,
    [createCacheStrategy()],
    [menuMiddleware]
  );

  renderJson(context)
    .on('error', (err) => console.error(err))
    .on('data', (file) => console.log(`Rendered ${file.path} with JSON`))
    .on('end', () => console.log('JSON ended'))
    .pipe(vinylFs.dest(outFolder));

  createReactRenderer(renderPath)(context)
    .on('error', (err) => console.error(err))
    .on('data', (file) => console.log(`Rendered ${file.path} with React`))
    .on('end', () => console.log('React ended'))
    .pipe(vinylFs.dest(outFolder));
});
