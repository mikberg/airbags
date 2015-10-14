// import {isContextOk} from '../src/context';
import {Readable} from 'stream';
import React from 'react';
import File from '../node_modules/vinyl';
import {renderToString} from 'react-dom/server';
import {match, RoutingContext} from 'react-router';
import AirbagsApi from '../src/api';
import CacheStrategy from '../src/api/cache';

function outUrl(nakedPath) {
  return `/${nakedPath}.html`;
}

function renderPath(routes, nakedPath, api, context) {
  const location = outUrl(nakedPath);

  return new Promise((resolve, reject) => {
    match({routes, location}, (error, rl, renderProps) => {
      if (!renderProps) {
        return reject(new Error(`Error while rendering ${nakedPath}: ${error}`));
      }

      const data = {};
      const dataPromises = renderProps.components
        .filter((component) => {
          return typeof component === 'function' && component.getData;
        })
        .map((component) => {
          return component.getData(context, api, renderProps.params).then((result) => {
            if (component.dataKey) {
              data[component.dataKey] = result;
            }
          });
        });

      const routerProps = Object.assign({}, renderProps, {
        createElement: (Component, props) => {
          const componentData = Component.dataKey && data[Component.dataKey] ?
            data[Component.dataKey] : {};

          const customProps = {};
          customProps[Component.dataKey] = componentData;

          const finalProps = Object.assign({}, props, customProps);
          return React.createElement(Component, finalProps);
        },
      });

      Promise.all(dataPromises)
        .then(() => {
          const contents = renderToString(<RoutingContext {...routerProps} />);
          return resolve(new File({
            path: `${nakedPath}.html`,
            contents: new Buffer(contents),
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
}

export default function createReactRenderer(routes) {
  return (context) => {
    const stream = new Readable({ objectMode: true });
    stream._read = () => {};
    const nakedPaths = Object.keys(context.getSiteMap());
    nakedPaths.push('index');

    const api = new AirbagsApi(context, [new CacheStrategy()]);

    const renderedFiles = nakedPaths.map((nakedPath) => {
      return renderPath(routes, nakedPath, api, context);
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
