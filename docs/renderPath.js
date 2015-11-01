import routes from './routes';
import Html from './components/Html';
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

      const ssrData = {};
      const dataComponents = renderProps.components
        .filter(Component => Component && Component.__SSR_ID);

      const dataPromise = Promise.all(
        dataComponents.map(Component =>
          Component.fetchData(renderProps).then(data => {
            ssrData[Component.__SSR_ID] = data;
            return data;
          })
        )
      );

      dataPromise.then(() => {
        const createElement = (Component, props) => {
          let finalProps;
          if (ssrData[Component.__SSR_ID]) {
            finalProps = Object.assign({}, props, ssrData[Component.__SSR_ID]);
          } else {
            finalProps = props;
          }

          return React.createElement(Component, finalProps);
        };

        const output = ReactDOM.renderToString(
          <RoutingContext {...renderProps} createElement={createElement} />
        );

        const html = ReactDOM.renderToStaticMarkup(
          <Html>
            <div id="react-root" dangerouslySetInnerHTML={{__html: output}}/>
            <script dangerouslySetInnerHTML={{__html: `var __SSR_DATA = ${JSON.stringify(ssrData)};`}} />
            <script src="/bundle.js" />
          </Html>
        );

        resolve(`<!doctype html>${html}`);
      });
    });
  });
}
