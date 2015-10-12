import vinylFs from 'vinyl-fs';
import fs from 'fs';
import collect from '../src/collect';
import markdownExtractor from '../src/extractors/markdown';
import {createContext} from '../src/context/';
import renderJson from '../src/render/json';
import createJadeRenderer from './jade';

const config = {};
const renderers = [
  renderJson,
  createJadeRenderer(fs.readFileSync('./template.jade', {encoding: 'utf-8'})),
];
const outFolder = './build/';

collect(vinylFs.src(['./pages/*.md']), markdownExtractor).then((siteMap) => {
  const context = createContext(siteMap, config);

  renderers.forEach((renderer) => {
    renderer(context).pipe(vinylFs.dest(outFolder));
  });
});
