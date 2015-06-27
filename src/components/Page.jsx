import React from 'react';
import {getFileContents} from '../utils/fileUtils';
import markdown from '../utils/markdown';

export default class Page extends React.Component {
  getMarkdown(location) {
    let contents = getFileContents(location.replace('.html', '.md'));
    return markdown(contents);
  }

  render() {
    let contents = this.getMarkdown(this.props.location);
    return <div dangerouslySetInnerHTML={{__html: contents}}></div>;
  }
}

Page.propTypes = {
  location: React.PropTypes.string
};
