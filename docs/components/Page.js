/* eslint no-proto:0 */
import React from 'react';

export default class Page extends React.Component {
  static propTypes = {
    pageData: React.PropTypes.object,
  }

  componentWillMount() {
    if (global.__SSR_DATA) {
      const props = global.__SSR_DATA[this.__proto__.constructor.name];
      if (props) {
        this.setState(props);
      }
    }
  }

  componentDidMount() {
    Page.fetchData(this.props)
      .then(data => {
        this.setState(data);
      });
  }

  componentWillReceiveProps(nextProps) {
    Page.fetchData(nextProps)
      .then(data => {
        this.setState(data);
      });
  }

  static fetchData(renderProps) {
    return global.api.getPageData(`pages/${renderProps.params.pageName}`)
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
