import React from 'react';
import {chain} from 'lodash';
import Menu from './Menu';
import Router from './Router';

let fs;
let path;

if (!process.browser) {
  fs = require('fs');
  path = require('path');
}

const pagesDir = 'pages/';

export default class Site extends React.Component {
  getPages() {
    if (!process.browser) {
      return this.serverGetPages();
    }
  }

  serverGetPages() {
    return chain(fs.readdirSync(pagesDir))
      .map((filename) => {
        return {
          path: path.join(pagesDir, filename)
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
          <Router path={this.props.path} />
        </body>
      </html>
    );
  }
}
