import through from 'through2';
import gutil from 'gulp-util';

export default function addApiFiles() {
  return through.obj(function inner(sourceFile, enc, cb) {
    this.push(sourceFile);

    if (!sourceFile.data) {
      return cb();
    }

    let apiFile = new gutil.File({
      path: sourceFile.path.replace(/\.md$/i, '.json')
    });

    let contents = JSON.stringify(sourceFile.data);
    apiFile.contents = new Buffer(contents, enc);

    this.push(apiFile);
    cb();
  });
}
