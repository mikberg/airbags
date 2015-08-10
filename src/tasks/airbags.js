import through from 'through2';
import gutil from 'gulp-util';
import yamlFront from 'yaml-front-matter';
import addDoctype from './addDoctype';
import {cache, contentCache} from './cache';
import renderWithReactComponent from './renderWithReactComponent';
import render from './render';
import {relativePath} from '../utils/taskUtils';

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

  function flush(cb) {
    let index = new gutil.File({path: 'index.md'});
    index.contents = new Buffer('');

    this.push(index);
    cb();
  }

  return through.obj(register, flush);
}

airbags.renderWithReactComponent = renderWithReactComponent;
airbags.render = render;
airbags.addDoctype = addDoctype;
