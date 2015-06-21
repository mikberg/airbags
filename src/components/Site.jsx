import React from 'react';
import Menu from './Menu';
import Router from './Router';

export default class Site extends React.Component {
  renderRouter() {
    return <Router path={this.props.path} />;
  }

  render() {
    return (
      <html>
        <head>
          <title>Site</title>
        </head>
        <body>
          <h1>Site</h1>
          <Menu />
          {this.renderRouter()}
        </body>
      </html>
    );
  }
}
