import React from 'react';

export default class Page extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired,
    '__page-data': React.PropTypes.object.isRequired,
  }

  static getData(api, params) {
    return api.getPageData('pages/' + params.pageName);
  }

  static dataKey = '__page-data';

  render() {
    const pageData = this.props[Page.dataKey];
    const html = { __html: pageData.html };

    return (
      <div>
        {pageData.meta.title ? <h1>{pageData.meta.title}</h1> : ''}
        <div dangerouslySetInnerHTML={html} />
      </div>
    );
  }
}
