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

  render() {
    return (
      <html>
        <head>
          <title>Site</title>
        </head>
        <body>
          <h1>Site</h1>
          <Menu />
          <Page path={this.props.path} />
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
