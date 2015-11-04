import React from 'react';
import Menu from './Menu';
import ssrify from '../helpers/ssrify';
import api from '../airbagsApi';

@ssrify('App')
export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    menu: React.PropTypes.array,
    config: React.PropTypes.object,
  }

  componentDidMount() {
    this.setStateFromApi(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setStateFromApi(nextProps);
  }

  setStateFromApi(props) {
    App.fetchData(props).then(data => this.setState(data));
  }

  static fetchData() {
    return Promise.all([
      api.getMenu(),
      api.getConfig(),
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
