import React from 'react';
import Page from './Page';

export default class RoutePane extends React.Component {
  constructor() {
    super();

    this.rules = {
      'index': this.home.bind(this),
      'pages/': this.page.bind(this)
      // '/': this.home.bind(this)
    };
  }

  home() {
    return <div>Yes, this is home</div>;
  }

  page() {
    return <Page path={this.props.path} />;
  }

  pageNotFound() {
    return <div>Terribly sorry, couldn't find page matching {this.props.path}.</div>;
  }

  render() {
    let matching = Object.keys(this.rules).filter((pattern) => {
      console.log(`Checking ${pattern} against ${this.props.path} -> ${this.props.path.startsWith(pattern)}`);
      return this.props.path.startsWith(pattern);
    });

    if (matching.length > 0) {
      return this.rules[matching[0]]();
    } else {
      return this.pageNotFound();
    }
  }
}

RoutePane.propTypes = {
  path: React.PropTypes.string
};

RoutePane.contextTypes = {
  airbagsApi: React.PropTypes.object
};
