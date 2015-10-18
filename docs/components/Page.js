import React from 'react';
import Transmit from 'react-transmit';

export default class Page extends React.Component {
  static propTypes = {
    pageData: React.PropTypes.object.isRequired,
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

export default Transmit.createContainer(Page, {
  fragments: {
    pageData: ({pageName}) => {
      return global.api.getPageData(`pages/${pageName}`);
    },
  },
});
