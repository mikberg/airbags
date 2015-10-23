import React from 'react';
import Transmit from 'react-transmit';
import Menu from './Menu';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    menu: React.PropTypes.array,
    configuration: React.PropTypes.object,
  }

  render() {
    const {menu} = this.props;
    const {configuration} = this.props;

    return (
      <div>
        <h1>{configuration.siteName}</h1>
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
    configuration() {
      return global.api.getContext().then((context) => {
        return context.configuration;
      });
    },
  },
});
