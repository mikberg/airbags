import React from 'react';

export default class Page extends React.Component {
  static propTypes = {
    params: React.PropTypes.object,
  }

  static getData(params) {
    return new Promise((resolve) => {
      resolve({some: 'data'});
    });
  }

  static dataKey = 'Page';

  render() {
    return (
      <div>I am page {this.props.params.nakedPath} {JSON.stringify(this.props.params)}</div>
    );
  }
}
