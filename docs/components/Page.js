import React from 'react';

export default class Page extends React.Component {
  static propTypes = {
    pageData: React.PropTypes.object,
  }

  componentWillMount() {
    if (global.__SSR_DATA) {
      const props = global.__SSR_DATA[this.__proto__.constructor.name];
      this.props = Object.assign({}, this.props, props);
    }
  }

  static fetchData(renderProps) {
    return global.api.getPageData(`pages/${renderProps.params.pageName}`)
      .then(pageData => ({ pageData }));
  }

  render() {
    const {pageData} = this.props;

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
