import React from 'react';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      counter: 0
    };
  }

  // componentWillMount() {
  //   setInterval(() => {
  //     this.setState({counter: this.state.counter + 1});
  //   }, 1000);
  // }

  render() {
    return <h1>I can count to {this.state.counter}</h1>;
  }
}
