import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import routes from './routes';
import {createHistory} from 'history';
// import {createContext} from '../src/context';
import menu from '../src/middleware/menu';
import createConfig from '../src/middleware/config';
import createApi from '../src/api';
import createHttpStrategy from '../src/api/http';
// import createCacheStrategy from '../src/api/cache';

// const context = createContext(global.contextData);
global.api = createApi(
  [
    // createCacheStrategy(context),
    createHttpStrategy('http://localhost:8080'),
  ],
  [
    menu,
    createConfig(),
  ]
);

const reactRoot = window.document.getElementById('react-root');
ReactDOM.render(<Router routes={routes} history={createHistory()}/>, reactRoot);
