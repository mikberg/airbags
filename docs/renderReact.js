// import {isContextOk} from '../src/context';
import {Readable} from 'stream';
import React from 'react';
import File from '../node_modules/vinyl';
import {renderToString} from 'react-dom/server';
import {match, RoutingContext} from 'react-router';

function outUrl(nakedPath) {
  return `/${nakedPath}.html`;
}

export default function createReactRenderer(routes) {
  return (context) => {
    const stream = new Readable({ objectMode: true });

    Object.keys(context.siteMap).forEach((nakedPath) => {
      const location = outUrl(nakedPath);
      match({routes, location: location}, (error, redirectLocation, renderProps) => {
        if (renderProps) {
          const contents = renderToString(<RoutingContext {...renderProps} />);
          const file = new File({
            path: `${nakedPath}.html`,
            contents: new Buffer(contents),
          });
          stream.push(file);
        } else {
          console.log(`Error while trying to render ${location}`);
        }
      });
    });

    stream.push(null);
    return stream;
  };
}
