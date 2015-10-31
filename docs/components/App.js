/* eslint no-proto:0 */
import React from 'react';
import Menu from './Menu';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    menu: React.PropTypes.array,
    config: React.PropTypes.object,
  }

  componentWillMount() {
    if (global.__SSR_DATA) {
      const props = global.__SSR_DATA[this.__proto__.constructor.name];
      this.setState(props);
    }
  }

  componentWillReceiveProps(nextProps) {
    App.fetchData(nextProps)
      .then(data => {
        this.setState(data);
      });
  }

  static fetchData() {
    return Promise.all([
      global.api.getMenu(),
      global.api.getConfig(),
    ]).then(([menu, config]) => {
      return { menu, config };
    });
  }

  render() {
    const {menu} = this.state || this.props;
    const {config} = this.state || this.props;

    if (!menu || !config) {
      return (
        <span>Loading ...</span>
      );
    }

    return (
      <div>
        <div>
          <h1>{config.siteName}</h1>
          <Menu menu={menu} />
          {this.props.children}
        </div>
      </div>
    );
  }
}
