import React from 'react';

export default class Preloaded extends React.Component {
  componentWillMount() {
    if (process.browser) {
      this.preloadedContents = document.getElementById(this.props.id).innerHTML;
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
