import React, { Component, PropTypes } from 'react';

export default class Html extends Component {
  static propTypes = {
    children: PropTypes.array,
    meta: PropTypes.array,
  };

  render() {
    return (
      <html>
        <head>
          { this.props.meta }
        </head>
        <body>
          { this.props.children }
        </body>
      </html>
    );
  }
}
