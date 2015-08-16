import React from 'react';
import Home from './Home';
import Menu from './Menu';

export default class App extends React.Component {
  renderRoute() {
    if (this.props.children) {
      return this.props.children;
    }

    return <Home />;
  }

  render() {
    return (
      <div>
        <h1>Site</h1>
        <Menu />

        {this.renderRoute()}
      </div>
    );
  }
}
