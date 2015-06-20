import React from 'react';

export default class Page extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <p>{this.props.contents}</p>;
  }
}

Page.propTypes = {
  contents: React.PropTypes.string
};
