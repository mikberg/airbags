import {isReadable} from 'isstream';
import File from 'vinyl';

/**
 * Extract data from vinyl file given an extractor
 */
export function extractFromFile(file, extractor) {
  if (!File.isVinyl(file)) {
    throw new Error('`file` must be a vinyl file');
  }

  return extractor(file.contents.toString());
}

/**
 * The collector is a function which takes a stream of files and builds up an
 * object describing all the contents it has been given. It also takes an
 * extractor, which is used to extract data per file. It outputs a promise
 * which resolves to the data structure.
 */
export default function collect(fileStream, extractor) {
  let siteMap = {};

  if (!isReadable(fileStream)) {
    throw new Error('fileStream must be readable stream');
  }

  if (typeof extractor !== 'function') {
    throw new Error('Extractor must be a function');
  }

  return new Promise((resolve, reject) => {
    fileStream.on('end', () => {
      resolve(siteMap);
    });

    fileStream.on('data', (file) => {
      try {
        siteMap[file.path] = extractFromFile(file, extractor);
      } catch(err) {
        reject(err);
      }
    });
  });
}
