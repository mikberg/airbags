import through from 'through2';

/**
 * Add a doctype to a file.
 * @param {string} doctype (optional), default: `<!DOCTYPE html>`
 */
export default function addDoctype(doctype) {
  let finalDoctype = doctype || '<!DOCTYPE html>\n';

  return through.obj((file, enc, cb) => {
    file.contents = Buffer.concat([
      new Buffer(finalDoctype, enc),
      file.contents
    ]);

    cb(null, file);
  });
}
