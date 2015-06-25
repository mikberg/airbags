import React from 'react';
import Menu from './Menu';
import Router from './Router';

export default class Site extends React.Component {
  renderRouter() {
    return <Router path={this.props.path} />;
  }

  renderCss() {
    let cssFilenames = this.props.cssFilenames ? this.props.cssFilenames : [];

    return cssFilenames.map((filename) => {
      return <link href={filename} key={filename} rel="stylesheet" />;
    });
  }

  render() {
    return (
      <html>
        <head>
          <title>Site</title>
          {this.renderCss()}
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

Site.propTypes = {
  cssFilenames: React.PropTypes.array,
  path: React.PropTypes.string
};
