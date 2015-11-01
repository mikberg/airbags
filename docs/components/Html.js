import React, { Component, PropTypes } from 'react';

export default class Html extends Component {
  static propTypes = {
    children: PropTypes.children,
  };

  render() {
    console.log('hi from html');
    return (
      <html>
        <head>
          <title>Rendered from React!</title>
        </head>
        <body>
          { this.props.children }
        </body>
      </html>
    );
  }
}
