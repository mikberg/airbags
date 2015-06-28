import React from 'react';
import Menu from './Menu';
import Router from './Router';

export default class Site extends React.Component {
  getContextVars() {
    return this.props;
  }

  renderRouter() {
    return <Router path={this.props.path} />;
  }

  renderCss() {
    let cssFilenames = this.props.cssFilenames ? this.props.cssFilenames : [];

    return cssFilenames.map((filename) => {
      return <link href={filename} key={filename} rel="stylesheet" />;
    });
  }

  // @TODO Replace with bundling manifest into javascript? Makes no sense w/o
  // javascript on the client side anyway, and gets rid of code from code.
  renderContextVarsScript() {
    let jsonProps = JSON.stringify(this.getContextVars());
    let defineScript = `var SITE_CONTEXT_VARS = ${jsonProps};`;
    return <script dangerouslySetInnerHTML={{__html: defineScript}}></script>;
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
          {this.renderContextVarsScript()}
        </body>
      </html>
    );
  }
}

Site.propTypes = {
  cssFilenames: React.PropTypes.array,
  path: React.PropTypes.string
};
