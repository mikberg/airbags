import {isReadable} from 'isstream';
import File from 'vinyl';

/**
 * The collector is a function which takes a stream of files and builds up an
 * object describing all the contents it has been given. It also takes an
 * extractor, which is used to extract data per file. It outputs a promise
 * which resolves to the data structure.
 */
export default function collect(fileStream, extractor) {
  if (!isReadable(fileStream)) {
    throw new Error('fileStream must be readable stream');
  }

  if (typeof extractor !== 'function') {
    throw new Error('Extractor must be a function');
  }

  return new Promise((resolve, reject) => {
    reject('Objects in stream must be of vinyl file type');
  });
}

/**
 * Extract data from vinyl file given an extractor
 */
export function extractFromFile(file, extractor) {
  if (!File.isVinyl(file)) {
    throw new Error('`file` must be a vinyl file');
  }

  return extractor(file.contents.toString());
}
