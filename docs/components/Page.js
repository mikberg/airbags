import React from 'react';

export default class Page extends React.Component {
  static propTypes = {
    pageData: React.PropTypes.object.isRequired,
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
