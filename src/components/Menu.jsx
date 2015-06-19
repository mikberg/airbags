import React from 'react';
import {map} from 'lodash';

export default class Menu extends React.Component {
  render() {
    let listElements = map(this.props.pages, (page) => {
      return (
        <li key={page.path}>
          <a href={page.path}>{page.path}</a>
        </li>
      );
    });

    return (
      <ul className="Menu">
        {listElements}
      </ul>
    );
  }
}

Menu.propTypes = {
  pages: React.PropTypes.object
};
