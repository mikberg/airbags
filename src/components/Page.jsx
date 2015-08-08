import React from 'react';
import markdown from '../utils/markdown';
import Preloaded from './Preloaded';

export default class Page extends React.Component {
  getFrontMatter() {
    return this.context.airbagsApi.getFrontMatter(this.props.path);
  }

  getContents() {
    return markdown(this.context.airbagsApi.getContents(this.props.path));
  }

  render() {
    let contents = this.getContents();
    return (
      <Preloaded id="page">
        <div dangerouslySetInnerHTML={{__html: contents}}></div>
      </Preloaded>
    );
  }
}

Page.propTypes = {
  path: React.PropTypes.string
};

Page.contextTypes = {
  airbagsApi: React.PropTypes.object
};
