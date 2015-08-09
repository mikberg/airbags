import React from 'react';
import Menu from './Menu';
// import Page from './Page';
import RoutePane from './Router';

export default class Site extends React.Component {
  getChildContext() {
    return {
      airbagsApi: this.props.airbagsApi
    };
  }

  render() {
    return (
      <html>
        <head>
          <title>Site</title>
          <link href="/style/style.css" rel="stylesheet" />
        </head>
        <body>
          <h1>Site</h1>
          <Menu />

          <RoutePane path={this.props.path} />

          <script src="/javascript/vendors.js" />
          <script src="/javascript/bundle.js" />
        </body>
      </html>
    );
  }
}

Site.propTypes = {
  airbagsApi: React.PropTypes.object,
  path: React.PropTypes.string
};

Site.childContextTypes = {
  airbagsApi: React.PropTypes.object
};
