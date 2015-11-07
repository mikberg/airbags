import React, { Component, PropTypes } from 'react';

export default class Html extends Component {
  static propTypes = {
    children: PropTypes.array,
  };

  render() {
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
