import React from 'react';

export default class Layout extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>Hello World</title>
        </head>
        <body>
          <div dangerouslySetInnerHTML={{__html: this.props.content}}
              id="App" />
          <script src="/javascript/bundle.js"></script>
        </body>
      </html>
    );
  }
}

Layout.propTypes = {
  content: React.PropTypes.string.isRequired
};
