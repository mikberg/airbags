import React from 'react';
import ssrify from '../helpers/ssrify';
import api from '../airbagsApi';

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
            return <h1>{pageData.meta.title}</h1>;
          }
        }()}
        <div dangerouslySetInnerHTML={{__html: pageData.html}} />
      </div>
    );
  }
}
