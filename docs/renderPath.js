import routes from './routes';
import React from 'react';
import Transmit from 'react-transmit';
import {match, RoutingContext} from 'react-router';

export default function renderPath(nakedPath) {
  const location = `/${nakedPath}.html`;

  return new Promise((resolve, reject) => {
    match({routes, location}, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        reject(new Error(`${nakedPath}->${location} resulted in redirect (not supported)`));
      } else if (error) {
        reject(new Error(`Error when rendering ${nakedPath}->${location}: ${error}`));
      } else if (!renderProps) {
        reject(new Error(`Unspecified error: did not receive renderProps when rendering ${nakedPath}->${location}`));
      }

      Transmit.renderToString(RoutingContext, renderProps).then(({reactString, reactData}) => {
        const contextData = {
          siteMap: global.api.context.getSiteMap(),
          configuration: global.api.context.getConfiguration(),
        };

        let output = (
          `<!doctype html>
          <html lang="en-us">
            <head>
              <meta charset="utf-8">
              <title>Coool</title>
            </head>
            <body>
              <div id="react-root"></div>
              <script>
                window.contextData = ${JSON.stringify(contextData)};
              </script>
              <script src="/bundle.js"></script>
            </body>
          </html>`
        );

        output = Transmit.injectIntoMarkup(output, reactData);
        resolve(output);
      }).catch(reject);
    });
  });
}
