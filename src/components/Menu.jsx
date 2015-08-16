import React from 'react';
import {Link} from 'react-router';

export default class Menu extends React.Component {
  getListElements() {
    return this.context.airbagsApi.getPages().map((frontMatter) => {
      return (
        <li key={frontMatter.title}>
          <a href={'/' + frontMatter.renderedPath}>{frontMatter.title}</a>
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
        <li>
          <Link to="/pages/colophon.html">Colophon</Link>
        </li>
      </ul>
    );
  }
}

Menu.contextTypes = {
  airbagsApi: React.PropTypes.object
};
