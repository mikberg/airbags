import {Router} from 'react-router';
import {isContextOk} from '../context';
import File from 'vinyl';
import {Readable} from 'stream';

function rendererModel(context) {
  this._read = () => {
    this.push(new File());
    // this.emit('error', new Error('this is my error'));
    this.push(null);
  };
}

export function createReactRenderer(routes) {
  if (typeof routes !== 'object') {
    throw new Error(`createReactRenderer expected routes object, got ${routes}`);
  }

  return (context) => {
    if (!isContextOk(context)) {
      throw new Error(`renderer expected a context, got ${context}`);
    }

    const renderer = new Readable({ objectMode: true });
    rendererModel.call(renderer);
    return renderer;
  };
}
