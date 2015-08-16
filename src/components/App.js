import React from 'react';
import Home from './Home';

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

        {this.renderRoute()}
      </div>
    );
  }
}
