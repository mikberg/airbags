import React from 'react';

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
        <li key="home"><a href="/">Home</a></li>
        {this.getListElements()}
      </ul>
    );
  }
}

Menu.contextTypes = {
  airbagsApi: React.PropTypes.object
};
