import React from 'react';
import AirbagsApi from '../api';

export default class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      page: null
    };
  }

  componentDidMount() {
    AirbagsApi
      .getPage('/pages/colophon.json')
      .then((page) => {
        this.setState({page});
      });
  }

  renderWithData() {
    return (
      <article>
        <h2>{this.state.page.frontMatter.title}</h2>
        {this.state.page.contents}
      </article>
    );
  }

  renderLoading() {
    return <div>Loading ...</div>;
  }

  render() {
    return (
      <div className="Page">
        {() => {
          if (this.state.page) {
            return this.renderWithData();
          }

          return this.renderLoading();
        }()}
      </div>
    );
  }
}
