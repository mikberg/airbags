let fs;

if (!process.browser) {
  fs = require('fs');
}

function getFileContentsServer(filepath) {
  return fs.readFileSync(filepath, {encoding: 'utf-8'});
}

function getFileContentsBrowser() {
  throw new Error('Not yet implemented for browsers');
}

export function getFileContents(filepath) {
  let contents;

  if (process.browser) {
    contents = getFileContentsBrowser(filepath);
  } else {
    contents = getFileContentsServer(filepath);
  }

  return contents;
}
