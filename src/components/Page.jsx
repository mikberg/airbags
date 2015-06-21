import React from 'react';
import {getFileContents} from '../utils/fileUtils';

export default class Page extends React.Component {
  getMarkdown(location) {
    return getFileContents(location + '.md');
  }

  render() {
    let contents = this.getMarkdown(this.props.location);
    return <div>{contents}</div>;
  }
}

Page.propTypes = {
  location: React.PropTypes.string
};
