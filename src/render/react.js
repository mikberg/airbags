import File from 'vinyl';
import {Readable} from 'stream';

function rendererModel(renderPath, api) {
  const nakedPathsPromise = api.getContext();

  let index = 0;

  this._read = () => {
    let nakedPath;

    nakedPathsPromise.then(context => {
      const nakedPaths = Object.keys(context.getSiteMap());

      if (index === nakedPaths.length) {
        return this.push(null);
      }
      nakedPath = nakedPaths[index];

      const originalPath = context.getSiteMap()[nakedPath].originalPath;

      const promise = renderPath(nakedPath);

      if (!(promise instanceof Promise)) {
        return this.emit('error', `Expected renderPath to return a promise, got ${promise}`);
      }

      promise
        .then((contents) => {
          if (typeof contents !== 'string') {
            throw new Error(`Expected renderPath to resolve to a string, got ${contents}`);
          }

          const file = new File({
            path: originalPath,
            contents: new Buffer(contents),
          });

          // Pushes originalPath into history, for later use
          file.path = `${nakedPath}.html`;

          this.push(file);
          index++;
        })
        .catch((err) => {
          this.emit('error', err);
        });
    });
  };
}

export default function createReactRenderer(renderPath) {
  if (typeof renderPath !== 'function') {
    throw new Error(`createReactRenderer expected a render function, got ${renderPath}`);
  }

  return (api) => {
    if (!typeof api.getContext === 'function') {
      throw new Error(`renderer expected an api, got ${api}`);
    }

    const renderer = new Readable({ objectMode: true });
    rendererModel.call(renderer, renderPath, api);
    return renderer;
  };
}
