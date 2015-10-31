import routes from './routes';
import React from 'react';
import ReactDOM from 'react-dom/server';
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

      const asyncComponents = {};
      const dataComponents = renderProps.components
        .filter(Component => Component && Component.fetchData);

      const dataPromise = Promise.all(
        dataComponents.map(Component =>
          Component.fetchData(renderProps).then(data => {
            asyncComponents[Component.name] = data;
            return data;
          })
        )
      );

      dataPromise.then(() => {
        const createElement = (Component, props) => {
          let finalProps;
          if (asyncComponents[Component.name]) {
            finalProps = Object.assign({}, props, asyncComponents[Component.name]);
          } else {
            finalProps = props;
          }

          return React.createElement(Component, finalProps);
        };

        const output = ReactDOM.renderToString(<RoutingContext {...renderProps} createElement={createElement} />);
        const html = `
        <!doctype html>
        <html>
          <head>
            <title>Cool page</title>
          </head>
          <body>
            <div id="react-root">${output}</div>
            <script src="/bundle.js"></script>
          </body>
        </html>
        `;

        resolve(html);
      });
    });
  });
}
