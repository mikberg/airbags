import App from './components/App';
import Page from './components/Page';
import { Router, Route } from 'react-router';
import React from 'react';

export default (
  <Router>
    <Route path="/" component={App}>
      <Route path="/index.html" />
      <Route path="pages/:nakedPath.html" component={Page} onEnter={Page.onEnter} />
    </Route>
  </Router>
);
