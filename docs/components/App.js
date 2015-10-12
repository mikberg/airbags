import React from 'react';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
  }

  render() {
    return (
      <div>
        <h1>Airbags Docs</h1>
        {this.props.children}
      </div>
    );
  }
}
