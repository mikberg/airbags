import React from 'react';
import Transmit from 'react-transmit';
import Menu from './Menu';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    menu: React.PropTypes.array,
    config: React.PropTypes.object,
  }

  render() {
    const {menu} = this.props;
    const {config} = this.props;

    return (
      <div>
        <h1>{config.siteName}</h1>
        <Menu menu={menu} />
        {this.props.children}
      </div>
    );
  }
}

export default Transmit.createContainer(App, {
  fragments: {
    menu() {
      return global.api.getMenu();
    },
    config() {
      return global.api.getConfig();
    },
  },
});
