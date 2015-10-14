import {isContextOk} from '../context';
import {Readable} from 'stream';
import File from 'vinyl';

export function fileFromContext(contextFile) {
  if (!contextFile.nakedPath) {
    throw new Error('fileFromContext needs supplied file to have `nakedPath`');
  }

  if (typeof contextFile.data !== 'object') {
    throw new Error('fileFromContext needs supplied file to have `data`');
  }

  return new File({
    path: `${contextFile.nakedPath}.json`,
    contents: new Buffer(JSON.stringify(contextFile.data)),
  });
}

/**
 * Creates a stream of JSON vinyl files from a context.
 */
export default function renderJson(context) {
  if (!isContextOk(context)) {
    throw new Error(`renderJson expected a context, got ${context}`);
  }

  const stream = new Readable({ objectMode: true });

  Object.keys(context.getSiteMap()).forEach((nakedPath) => {
    stream.push(fileFromContext(context.getSiteMap()[nakedPath]));
  });

  stream.push(null);
  return stream;
}
