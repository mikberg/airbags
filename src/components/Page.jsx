import React from 'react';
import AirbagsApi from '../api';
import markdown from '../utils/markdown';

export default class Page extends React.Component {
  constructor() {
    super();

    // if (AirbagsApi.isPageInCache('/pages/colophon')) {
    //   this.state = {page: AirbagsApi.getPageSync('/pages/colophon')};
    // } else {
    //   this.state = {page: null};
    // }

    this.state = {page: null};
  }

  fetchPage() {
    AirbagsApi
      .getPage(this.props.params.pageName)
      .then((page) => {
        this.setState({page});
      });
  }

  componentDidMount() {
    if (!this.state.page) {
      this.fetchPage();
    }
  }

  componentDidUpdate(prevProps) {
    let oldPageName = prevProps.params.pageName;
    let newPageName = this.props.params.pageName;

    if (oldPageName !== newPageName) {
      this.fetchPage();
    }
  }

  renderWithData() {
    let html = markdown(this.state.page.contents);
    return (
      <article>
        <div dangerouslySetInnerHTML={{__html: html}} />
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
