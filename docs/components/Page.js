import React from 'react';

export default class Page extends React.Component {
  static propTypes = {
    params: React.PropTypes.object,
  }

  render() {
    return (
      <div>I am page {this.props.params.nakedPath}</div>
    );
  }
}
