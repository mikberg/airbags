import gutil from 'gulp-util';
import through from 'through2';

export default function createManifestStream(manifest) {
  let stream = through.obj(function push(file, enc, cb) {
    this.push(file);
    return cb();
  });

  let indexFile = new gutil.File({
    cwd: '',
    base: '',
    path: 'index.html',
    contents: new Buffer(JSON.stringify({path: 'index.html'}))
  });
  stream.write(indexFile);

  manifest.pages.forEach((pageManifest) => {
    let file = new gutil.File({
      cwd: '',
      base: '',
      path: pageManifest.path,
      contents: new Buffer(JSON.stringify(pageManifest))
    });

    stream.write(file);
  });

  return stream;
}
