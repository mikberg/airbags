import React from 'react';
import DocumentMeta from 'react-document-meta';
import Menu from './Menu';
import ssrify from '../helpers/ssrify';
import api from '../airbagsApi';

if (process.env.__BROWSER__) {
  require('../styles/App.scss');
}

@ssrify('App')
export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object,
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

    const metaData = {
      title: config.siteName,
      meta: {
        charSet: 'utf-8',
      },
    };

    return (
      <div className="App">
        <DocumentMeta {...metaData} />
        <div className="title">
          <h1>{config.siteName}</h1>
        </div>

        <Menu menu={menu} />

        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
