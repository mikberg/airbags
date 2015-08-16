import React from 'react';
import {Link} from 'react-router';
import api from '../api';

export default class Menu extends React.Component {
  getListElements() {
    let pages = api.getPagesSync();
    return Object.keys(pages)
      .filter((key) => pages[key].frontMatter)
      .map((key) => {
        let page = pages[key];
        return (
          <li key={page.path}>
            <Link to={page.path + '.html'}>
              {page.frontMatter.title || page.path}
            </Link>
          </li>
        );
      });
  }

  render() {
    return (
      <ul className="Menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        {this.getListElements()}
      </ul>
    );
  }
}

Menu.contextTypes = {
  airbagsApi: React.PropTypes.object
};
