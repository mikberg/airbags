import through from 'through2';
import gutil from 'gulp-util';
import yamlFront from 'yaml-front-matter';
import addDoctype from './addDoctype';
import render from './render';
import addApiFiles from './addApiFiles';
import {relativePath} from '../utils/taskUtils';

export default function airbags() {
  function register(file, enc, cb) {
    let frontMatter = yamlFront.loadFront(file.contents);
    let contents = frontMatter.__content;
    delete frontMatter.__content;

    file.data = {
      contents,
      frontMatter,
      path: '/' + relativePath(file.path).replace(/\.md/, '')
    };

    gutil.log(`Airbags registered '${frontMatter.title || file.path}'`);

    this.push(file);
    cb();
  }

  function flush(cb) {
    let index = new gutil.File({path: 'index.md'});
    index.contents = new Buffer('');

    this.push(index);
    cb();
  }

  return through.obj(register, flush);
}

airbags.render = render;
airbags.addDoctype = addDoctype;
airbags.addApiFiles = addApiFiles;
