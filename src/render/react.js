import {isContextOk} from '../context';
import File from 'vinyl';
import {Readable} from 'stream';

function rendererModel(renderPath, context) {
  const nakedPaths = Object.keys(context.getSiteMap());
  let index = 0;

  this._read = () => {
    let nakedPath;
    if (index === nakedPaths.length) {
      return this.push(null);
    }
    nakedPath = nakedPaths[index];

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
          path: `/${nakedPath}.html`,
          contents: new Buffer(contents),
        });

        this.push(file);
        index++;
      })
      .catch((err) => {
        this.emit('error', err);
      });
  };
}

export function createReactRenderer(renderPath) {
  if (typeof renderPath !== 'function') {
    throw new Error(`createReactRenderer expected a render function, got ${renderPath}`);
  }

  return (context) => {
    if (!isContextOk(context)) {
      throw new Error(`renderer expected a context, got ${context}`);
    }

    const renderer = new Readable({ objectMode: true });
    rendererModel.call(renderer, renderPath, context);
    return renderer;
  };
}
