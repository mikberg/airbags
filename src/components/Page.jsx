import React from 'react';
import {getFileContents} from '../utils/fileUtils';
import markdown from '../utils/markdown';

export default class Page extends React.Component {
  getMarkdown(path) {
    let contents = getFileContents(path.replace('.html', '.md'));
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
