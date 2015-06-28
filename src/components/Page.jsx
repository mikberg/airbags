import React from 'react';
import {getContentFileContents} from '../utils/content';
import markdown from '../utils/markdown';

export default class Page extends React.Component {
  getMarkdown(path) {
    let contents = getContentFileContents(path.replace('.html', '.md'));
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
