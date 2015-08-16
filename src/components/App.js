import React from 'react';
import Home from './Home';
import Menu from './Menu';
import api from '../api';

export default class App extends React.Component {
  constructor() {
    super();

    if (process.browser && window.__CACHE__) {
      api.loadCache(window.__CACHE__);
    }
  }

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
