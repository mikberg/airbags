import {Router} from 'react-router';
import Transmit from 'react-transmit';
import routes from './routes';
import {createHistory} from 'history';
import {createContext} from '../src/context';
import menuMiddleware from '../src/middleware/menuMiddleware';
import AirbagsApi from '../src/api';
import HttpStrategy from '../src/api/http';
import CacheStrategy from '../src/api/cache';

const context = createContext(global.contextData, [menuMiddleware]);
global.api = new AirbagsApi(context, [
  new CacheStrategy(),
  new HttpStrategy('http://localhost:8080'),
]);

const reactRoot = window.document.getElementById('react-root');
Transmit.render(Router, {routes, history: createHistory()}, reactRoot);
