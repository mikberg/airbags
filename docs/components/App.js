import React from 'react';
import Menu from './Menu';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    '__app-data': React.PropTypes.object.isRequired,
  }

  static getData(context) {
    return new Promise((resolve) => {
      resolve({
        siteName: context.getConfiguration().siteName,
        menu: context.getMenu ? context.getMenu() : null,
      });
    });
  }

  static dataKey = '__app-data';

  render() {
    const appData = this.props[App.dataKey];

    return (
      <div>
        <h1>{appData.siteName || '(no title set)'}</h1>

        <Menu menu={appData.menu} />

        {this.props.children}
      </div>
    );
  }
}
