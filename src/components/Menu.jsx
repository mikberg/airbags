import React from 'react';
import {map} from 'lodash';
import {getUrls} from '../utils/fileUtils';

export default class Menu extends React.Component {
  getPages() {
    return getUrls('pages/');
  }

  render() {
    let listElements = map(this.getPages(), (page) => {
      return (
        <li key={page.path}>
          <a href={page.path}>{page.path}</a>
        </li>
      );
    });

    return (
      <ul className="Menu">
        <li key="home"><a href="/">Home</a></li>
        {listElements}
      </ul>
    );
  }
}

Menu.propTypes = {
  pagesDir: React.PropTypes.string
};
