import fs from 'vinyl-fs';
import collect from '../src/collect';
import markdownExtractor from '../src/extractors/markdown';
import {createContext} from '../src/context/';
import renderJson from '../src/render/json';

const config = {};
const renderers = [renderJson];
const outFolder = './build/';

collect(fs.src(['./pages/*.md']), markdownExtractor).then((siteMap) => {
  const context = createContext(siteMap, config);

  renderers.forEach((renderer) => {
    renderer(context).pipe(fs.dest(outFolder));
  });
});
