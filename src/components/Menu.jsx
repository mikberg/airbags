import React from 'react';

export default class Menu extends React.Component {
  getPages() {
    return this.context.manifest.pages;
  }

  render() {
    let listElements = this.getPages().map((page) => {
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

Menu.contextTypes = {
  manifest: React.PropTypes.object
};
