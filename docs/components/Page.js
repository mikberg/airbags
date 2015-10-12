import React from 'react';

export default class Page extends React.Component {
  static propTypes = {
    params: React.PropTypes.object,
    Page: React.PropTypes.object,
  }

  static getData(api, params) {
    // @TODO: How to get rid of the "pages/" here? See routes.
    return api.getPageHtml('pages/' + params.nakedPath).then((html) => {
      return { __html: html };
    });
  }

  static dataKey = 'Page';

  render() {
    const pageData = this.props.params.Page;

    return (
      <div>
        <em>I am a page!</em>
        <div dangerouslySetInnerHTML={pageData} />
      </div>
    );
  }
}
