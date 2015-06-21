import React from 'react';
import {RouterMixin} from 'react-mini-router';

export default React.createClass({
  mixins: [RouterMixin],

  routes: {
    '/index': 'home',
    '/pages/:text': 'page'
  },

  render: function render() {
    return this.renderCurrentRoute();
  },

  home: () => {
    return <div>Yes, this is home</div>;
  },

  page: (location) => {
    return <div>Yes, this is page {location}</div>;
  }
});
