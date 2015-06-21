import React from 'react';
import {RouteHandler} from 'react-router';

export default class App extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>Site</title>
        </head>
        <body>
          <RouteHandler />
        </body>
      </html>
    );
  }
}
