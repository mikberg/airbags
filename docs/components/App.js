import React from 'react';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    '__app-data': React.PropTypes.object.isRequired,
  }

  static getData(context) {
    return new Promise((resolve) => {
      resolve({
        siteName: context.getConfiguration().siteName,
      });
    });
  }

  static dataKey = '__app-data';

  render() {
    const appData = this.props[App.dataKey];

    return (
      <div>
        <h1>{appData.siteName || '(no title set)'}</h1>
        {this.props.children}
      </div>
    );
  }
}
