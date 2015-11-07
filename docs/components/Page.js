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
    return api.getPageData(`pages/${renderProps.params.pageName}`)
      .then(pageData => ({ pageData }));
  }

  render() {
    if (process.env.__BROWSER__) {
      hljs.initHighlightingOnLoad();
    }

    const { pageData } = this.state || this.props;

    if (!pageData) {
      return (
        <span>Loading ...</span>
      );
    }

    return (
      <div>
        {() => {
          if (pageData.meta.title) {
            return <h2>{pageData.meta.title}</h2>;
          }
        }()}
        <div dangerouslySetInnerHTML={{__html: pageData.html}} />
      </div>
    );
  }
}
