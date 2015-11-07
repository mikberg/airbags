import App from './components/App';
import Page from './components/Page';
import { Router, Route, IndexRoute } from 'react-router';
import React from 'react';

export default (
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Page} />
      <Route path="/index.html" component={Page} />
      <Route path="pages/:pageName.html" component={Page} />
    </Route>
  </Router>
);
