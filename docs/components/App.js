import React from 'react';
// import Transmit from 'react-transmit';
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
      this.props = Object.assign({}, this.props, props);
    }
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
    const {menu} = this.props;
    const {config} = this.props;

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
