import vinylFs from 'vinyl-fs';
// import fs from 'fs';
import collect from '../src/collect';
import markdownExtractor from '../src/extractors/markdown';
import {createContext} from '../src/context/';
import renderJson from '../src/render/json';
// import createJadeRenderer from './jade';
import createReactRenderer from './renderReact';
import routes from './routes';

const config = {};
const renderers = [
  renderJson,
  // createJadeRenderer(fs.readFileSync('./template.jade', {encoding: 'utf-8'})),
  createReactRenderer(routes),
];
const outFolder = './build/';

collect(vinylFs.src(['./pages/*.md'], { base: process.cwd() }), markdownExtractor).then((siteMap) => {
  const context = createContext(siteMap, config);

  renderers.forEach((renderer) => {
    renderer(context)
      .pipe(vinylFs.dest(outFolder));
  });
});
