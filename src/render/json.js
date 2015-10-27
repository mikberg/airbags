import {Readable} from 'stream';
import File from 'vinyl';

export function fileFromData(nakedPath, data) {
  if (!nakedPath) {
    throw new Error(`fileFromData needs nakedPath, got ${nakedPath}`);
  }

  if (typeof data !== 'object') {
    throw new Error(`fileFromData needs data, got ${data}`);
  }

  return new File({
    path: `${nakedPath}.json`,
    contents: new Buffer(JSON.stringify(data)),
  });
}

export function contextFile(context) {
  return new File({
    path: `context.json`,
    contents: new Buffer(JSON.stringify(context)),
  });
}

/**
 * Creates a stream of JSON vinyl files from a context.
 */
export default function renderJson(api) {
  if (!typeof api.getContext === 'function') {
    throw new Error(`renderJson expected a api, got ${api}`);
  }

  const stream = new Readable({ objectMode: true });
  stream._read = () => {};

  api.getContext().then(context => {
    const promises = Object.keys(context.getSiteMap())
      .map(nakedPath =>
        api.getPageData(nakedPath).then(data => ({ nakedPath, data }))
      );

    Promise.all(promises)
      .then(datas => {
        datas.forEach(({nakedPath, data}) => {
          stream.push(fileFromData(nakedPath, data));
        });

        stream.push(contextFile(context));
        stream.push(null);
      })
      .catch((err) => {
        stream.emit('error', err);
      });
  });

  return stream;
}
