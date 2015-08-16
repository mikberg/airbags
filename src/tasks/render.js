import through from 'through2';
import gutil from 'gulp-util';
// import {cache} from './cache';
import {changeExtension, relativePath} from '../utils/taskUtils';

export default function render(renderFn) {
  function inner(sourceFile, enc, cb) {
    let renderedFile = new gutil.File({
      base: sourceFile.base,
      cwd: sourceFile.cwd,
      path: changeExtension(sourceFile.path, '.html')
    });

    let writeContents = (err, contents) => {
      if (err || !contents) {
        return cb(err);
      }

      renderedFile.contents = new Buffer(contents, enc);

      gutil.log(`Airbags rendered '${relativePath(sourceFile.path)}'`);

      this.push(renderedFile);
      this.push(sourceFile);

      cb();
    };

    renderFn(sourceFile, writeContents);
  }

  return through.obj(inner);
}
