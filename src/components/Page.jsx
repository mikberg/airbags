import React from 'react';
import markdown from '../utils/markdown';

export default class Page extends React.Component {
  getMarkdown(path) {
    let contents = this.context.manifest.pages.filter((page) => {
      return page.url === '/' + path;
    })[0].contents;

    console.log(contents);

    return markdown(contents);
  }

  render() {
    let contents = this.getMarkdown(this.props.path);
    return <div dangerouslySetInnerHTML={{__html: contents}}></div>;
  }
}

Page.propTypes = {
  path: React.PropTypes.string
};

Page.contextTypes = {
  manifest: React.PropTypes.object
};
