import through from 'through2';

/**
 * Add a doctype to a file.
 * @param {string} doctype (optional), default: `<!DOCTYPE html>`
 */
export default function addDoctype(doctype) {
  let finalDoctype = doctype || '<!DOCTYPE html>\n';

  return through.obj(function inner(file, enc, cb) {
    if (/\.html$/.test(file.path)) {
      file.contents = Buffer.concat([
        new Buffer(finalDoctype, enc),
        file.contents
      ]);
    }

    this.push(file);
    cb();
  });
}
