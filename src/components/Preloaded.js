import React from 'react';
import escapeTextContentForBrowser from 'react/lib/escapeTextContentForBrowser';

export default class Preloaded extends React.Component {
  componentWillMount() {
    if (process.browser) {
      this.preloadedContents = document.getElementById(this.props.id).innerHTML;
      this.preloadedContents = escapeTextContentForBrowser(this.preloadedContents);
    }
  }

  renderPreloaded() {
    return (
      <div
         dangerouslySetInnerHTML={{__html: this.preloadedContents}}
         id={this.props.id}>
      </div>
    );
  }

  renderChildren() {
    return <div id={this.props.id}>{this.props.children}</div>;
  }

  render() {
    if (this.preloadedContents) {
      return this.renderPreloaded();
    }

    return this.renderChildren();
  }
}

Preloaded.propTypes = {
  id: React.PropTypes.string.isRequired
};
