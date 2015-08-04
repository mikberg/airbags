import React from 'react';
import Menu from './Menu';
import Page from './Page';
// import Router from './Router';

export default class Site extends React.Component {
  getChildContext() {
    return {
      airbagsApi: this.props.airbagsApi
    };
  }

  ghettoRouter() {
    let page;

    if (this.props.path === 'index.md') {
      page = <div>Yes, this is index.</div>;
    } else {
      page = <Page path={this.props.path} />;
    }

    return page;
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
          {this.ghettoRouter()}

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
