import React from 'react';
import Page from './Page';

export default class NakedPathProxy extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired,
  };

  render() {
    return <Page variables={{pageName: this.props.params.pageName}}/>;
  }
}
