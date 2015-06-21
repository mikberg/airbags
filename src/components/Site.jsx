import React from 'react';
import Menu from './Menu';
import Router from './Router';

export default class Site extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>Site</title>
        </head>
        <body>
          <h1>Site</h1>
          <Menu />
          <Router path={this.props.path} />
        </body>
      </html>
    );
  }
}
