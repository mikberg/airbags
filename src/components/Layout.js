import React from 'react';
import api from '../api';

export default class Layout extends React.Component {
  renderCacheScript() {
    let js = `window.__CACHE__ = ${JSON.stringify(api.getCache())}`;
    return <script dangerouslySetInnerHTML={{__html: js}}></script>;
  }

  render() {
    return (
      <html>
        <head>
          <title>Hello World</title>
        </head>
        <body>
          <div dangerouslySetInnerHTML={{__html: this.props.content}}
              id="App" />

          {this.renderCacheScript()}
          <script src="/javascript/bundle.js"></script>
        </body>
      </html>
    );
  }
}

Layout.propTypes = {
  content: React.PropTypes.string.isRequired
};
