import {match, RoutingContext} from 'react-router';
import {renderToString} from 'react-dom/server';
import React from 'react';
import {isContextOk} from '../context';
import AirbagsApi from '../api';
import File from 'vinyl';
import {Readable} from 'stream';

function urlFromNakedPath(nakedPath) {
  return `/${nakedPath}.html`;
}

export function renderPath(routes, nakedPath, api, context) {
  const location = urlFromNakedPath(nakedPath);

  return new Promise((resolve, reject) => {
    match({routes, location}, (err, redirectLocation, renderProps) => {
      if (err) {
        return reject(new Error(`Error when rendering ${nakedPath}->${location}: ${err}`));
      }

      if (redirectLocation) {
        return reject(new Error(`${nakedPath}->${location} redirected (not supported)`));
      }

      if (!renderProps) {
        return reject(new Error(`Error when rendering ${nakedPath}->${location}`));
      }

      let reactString;

      try {
        reactString = renderToString(<RoutingContext {...renderProps} />);
      } catch (error) {
        return reject(error);
      }

      resolve(reactString);
    });
  });
}

function rendererModel(routes, api, context) {
  const nakedPaths = Object.keys(context.getSiteMap());
  let index = 0;

  this._read = () => {
    let nakedPath;
    if (index === nakedPaths.length) {
      return this.push(null);
    }
    nakedPath = nakedPaths[index];

    this.renderPath(routes, nakedPath, api, context)
      .then((contents) => {
        const file = new File({
          contents: new Buffer(contents),
        });

        this.push(file);
        index++;
      })
      .catch((err) => {
        this.emit('error', err);
      });
  };

  // Attached here to allow for stubbing
  this.renderPath = renderPath;
}

export function createReactRenderer(routes, api) {
  if (typeof routes !== 'object') {
    throw new Error(`createReactRenderer expected routes object, got ${routes}`);
  }

  if (!(api instanceof AirbagsApi)) {
    throw new Error(`createReactRenderer expected instance of AirbagsApi, got ${api}`);
  }

  return (context) => {
    if (!isContextOk(context)) {
      throw new Error(`renderer expected a context, got ${context}`);
    }

    const renderer = new Readable({ objectMode: true });
    rendererModel.call(renderer, routes, api, context);
    return renderer;
  };
}
