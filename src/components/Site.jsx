import React from 'react';
import {chain} from 'lodash';
import Menu from './Menu';

let fs;
let path;

if (!process.browser) {
  fs = require('fs');
  path = require('path');
}

export default class Site extends React.Component {
  getPages() {
    if (!process.browser) {
      return this.serverGetPages();
    }
  }

  serverGetPages() {
    return chain(fs.readdirSync(this.props.pagesDir))
      .map((filename) => {
        return {
          path: path.join(this.props.pagesDir, filename)
        };
      })
      .indexBy('path')
      .value();
  }

  render() {
    let pages = this.getPages();

    return (
      <html>
        <head>
          <title>Site</title>
        </head>
        <body>
          <h1>Site</h1>
          <Menu pages={pages} />
        </body>
      </html>
    );
  }
}

Site.propTypes = {
  pagesDir: React.PropTypes.string
};
