import React from 'react';
import {Route} from 'react-router';
import * as components from './components';

export default [
  <Route path="/" component={components.App}>
    <Route path="index.html"/>
    <Route path="pages/:pageName.html" component={components.Page} />
  </Route>
];
