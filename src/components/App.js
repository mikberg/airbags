import React from 'react';
import AirbagsApi from '../api';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      page: null
    };
  }

  componentDidMount() {
    AirbagsApi.getPage('pages/colophon.json').then((page) => {
      this.setState({page});
    });
  }

  render() {
    if (!this.state.page) {
      return <div>Loading ...</div>;
    }

    return (
      <div>
        <h1>{this.state.page.frontMatter.title}</h1>
        <small>{this.state.page.frontMatter.tags}</small>
        <div>{this.state.page.contents}</div>
      </div>
    );
  }
}
