import {isReadable} from 'isstream';
import File from 'vinyl';
import indexBy from 'lodash.indexBy';
import path from 'path';

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
 * Remove file extension from a file path
 */
export function removeFileExtension(filePath) {
  const {dir, name} = path.parse(filePath);
  return `${dir}/${name}`;
}

export const createNakedPath = removeFileExtension;

/**
 * The collector is a function which takes a stream of files and builds up an
 * object describing all the contents it has been given. It also takes an
 * extractor, which is used to extract data per file. It outputs a promise
 * which resolves to the data structure.
 */
export default function collect(fileStream, extractor) {
  const files = [];

  if (!isReadable(fileStream)) {
    throw new Error('fileStream must be readable stream');
  }

  if (typeof extractor !== 'function') {
    throw new Error('Extractor must be a function');
  }

  return new Promise((resolve, reject) => {
    fileStream.on('end', () => {
      resolve(indexBy(files, 'nakedPath'));
    });

    fileStream.on('data', (file) => {
      try {
        files.push({
          data: extractFromFile(file, extractor),
          originalPath: file.path,
          nakedPath: createNakedPath(file.path),
        });
      } catch (err) {
        reject(err);
      }
    });
  });
}

/**
 * Verifies a sitemap is plausible
 */
export function isSiteMapOk(siteMap) {
  if (typeof siteMap !== 'object') {
    return false;
  }

  return Object.keys(siteMap).every((nakedPath) => {
    return nakedPath === siteMap[nakedPath].nakedPath
      && !!siteMap[nakedPath].originalPath
      && !!siteMap[nakedPath].data;
  });
}
