import {Router} from 'react-router';
import Transmit from 'react-transmit';
import routes from './routes';
import {createHistory} from 'history';
import {createContext} from '../src/context';
import menuMiddleware from '../src/middleware/menuMiddleware';
import createApi from '../src/api';
import createHttpStrategy from '../src/api/http';
import createCacheStrategy from '../src/api/cache';

const context = createContext(global.contextData);
global.api = createApi(
  context,
  [
    createCacheStrategy(),
    createHttpStrategy('http://localhost:8080'),
  ],
  [
    menuMiddleware,
  ]
);

const reactRoot = window.document.getElementById('react-root');
Transmit.render(Router, {routes, history: createHistory()}, reactRoot);
