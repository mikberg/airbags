import routes from './routes';
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

      global.api.getContext().then((context) => {
        Transmit.renderToString(RoutingContext, renderProps).then(({reactString, reactData}) => {
          let output = (
            `<!doctype html>
            <html lang="en-us">
              <head>
                <meta charset="utf-8">
                <title>Coool</title>
              </head>
              <body>
                <div id="react-root">${reactString}</div>
                <script>
                  window.contextData = ${JSON.stringify(context)};
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
  });
}
