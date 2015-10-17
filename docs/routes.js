import App from './components/App';
import NakedPathProxy from './components/NakedPathProxy';
import { Router, Route } from 'react-router';
import React from 'react';

export default (
  <Router>
    <Route path="/" component={App}>
      <Route path="/index.html" />
      <Route path="pages/:pageName.html" component={NakedPathProxy} />
    </Route>
  </Router>
);
