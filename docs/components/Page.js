import React from 'react';
import hljs from 'highlight.js';
import ssrify from '../helpers/ssrify';
import api from '../airbagsApi';

if (process.env.__BROWSER__) {
  require('../styles/Page.scss');
}

@ssrify('Page')
export default class Page extends React.Component {
  static propTypes = {
    pageData: React.PropTypes.object,
  }

  componentDidMount() {
    this.setStateFromApi(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setStateFromApi(nextProps);
  }

  setStateFromApi(props) {
    this.constructor.fetchData(props).then(data => this.setState(data));
  }

  static fetchData(renderProps) {
    if (renderProps.params.pageName) {
      return api.getPageData(`pages/${renderProps.params.pageName}`)
        .then(pageData => ({ pageData }));
    }
    return api.getPageData('index').then(pageData => ({ pageData }));
  }

  render() {
    if (process.env.__BROWSER__) {
      setTimeout(() => {
        const matches = document.querySelectorAll('pre code');
        for (let idx = 0; idx < matches.length; idx++) {
          hljs.highlightBlock(matches[idx]);
        }
      });
    }

    const { pageData } = this.state || this.props;

    if (!pageData) {
      return (
        <span>Loading ...</span>
      );
    }

    return (
      <div>
        <div dangerouslySetInnerHTML={{__html: pageData.html}} />
      </div>
    );
  }
}
