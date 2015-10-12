// import {isContextOk} from '../src/context';
import {Readable} from 'stream';
import React from 'react';
import File from '../node_modules/vinyl';
import {renderToString} from 'react-dom/server';
import {match, RoutingContext} from 'react-router';

function outUrl(nakedPath) {
  return `/${nakedPath}.html`;
}

function renderPath(routes, nakedPath) {
  const location = outUrl(nakedPath);

  return new Promise((resolve, reject) => {
    match({routes, location}, (error, rl, renderProps) => {
      if (!renderProps) {
        return reject(new Error(`Error while rendering ${nakedPath}: ${error}`));
      }

      const dataPromises = renderProps.components
        .filter((component) => {
          return typeof component === 'function' && component.getData;
        })
        .map((component) => {
          return component.getData(renderProps.params).then((result) => {
            if (component.dataKey) {
              renderProps.params[component.dataKey] = result;
            }
          });
        });

      Promise.all(dataPromises).then(() => {
        const contents = renderToString(<RoutingContext {...renderProps} />);
        return resolve(new File({
          path: `${nakedPath}.html`,
          contents: new Buffer(contents),
        }));
      });
    });
  });
}

export default function createReactRenderer(routes) {
  return (context) => {
    const stream = new Readable({ objectMode: true });
    stream._read = () => {};
    const nakedPaths = Object.keys(context.siteMap);
    nakedPaths.push('index');

    const renderedFiles = nakedPaths.map((nakedPath) => {
      return renderPath(routes, nakedPath);
    });

    Promise.all(renderedFiles)
      .then((files) => {
        files.forEach((file) => {
          stream.push(file);
        });
        stream.push(null);
      })
      .catch((err) => {
        stream.emit('error', err);
        stream.push(null);
      });

    return stream;
  };
}
