import React from 'react';

export default class Menu extends React.Component {
  getPageManifestFragments() {
    return this.context.manifest.pages;
  }

  getListElements() {
    return this.getPageManifestFragments().map((frag) => {
      return this.renderListElement(frag);
    });
  }

  renderListElement(frag) {
    let title = frag.frontMatter.title || frag.path;
    return (
      <li key={frag.path}>
        <a href={frag.url}>{title}</a>
      </li>
    );
  }

  render() {
    return (
      <ul className="Menu">
        <li key="home"><a href="/">Home</a></li>
        {this.getListElements()}
      </ul>
    );
  }
}

Menu.contextTypes = {
  manifest: React.PropTypes.object
};
