import React from 'react';
import {RouterMixin} from 'react-mini-router';
import Page from './Page';

export default React.createClass({
  mixins: [RouterMixin],

  routes: {
    'index.html': 'home',
    'pages/:text': 'page'
  },

  render: function render() {
    return this.renderCurrentRoute();
  },

  home: () => {
    return <div>Yes, this is home</div>;
  },

  page: (location) => {
    return <Page location={'pages/' + location} />;
  }
});
