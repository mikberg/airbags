import React from 'react';

export default class Page extends React.Component {
  static propTypes = {
    params: React.PropTypes.object,
    Page: React.PropTypes.object,
  }

  static getData(api, params) {
    // @TODO: How to get rid of the "pages/" here? See routes.
    return api.getPageData('pages/' + params.nakedPath);
  }

  static dataKey = '__page-data';

  render() {
    const pageData = this.props.params[Page.dataKey];
    const html = { __html: pageData.html };

    return (
      <div>
        {pageData.meta.title ? <h1>{pageData.meta.title}</h1> : ''}
        <div dangerouslySetInnerHTML={html} />
      </div>
    );
  }
}
