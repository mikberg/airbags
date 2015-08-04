import React from 'react';
import markdown from '../utils/markdown';

export default class Page extends React.Component {
  getFrontMatter() {
    return this.context.airbagsApi.getFrontMatter(this.props.path);
  }

  getContents() {
    return markdown(this.context.airbagsApi.getContents(this.props.path));
  }

  render() {
    let contents = this.getContents();
    return <div dangerouslySetInnerHTML={{__html: contents}}></div>;
  }
}

Page.propTypes = {
  path: React.PropTypes.string
};

Page.contextTypes = {
  airbagsApi: React.PropTypes.object
};
