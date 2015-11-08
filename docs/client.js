import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import routes from './routes';
import {createHistory} from 'history';

const reactRoot = window.document.getElementById('react-root');
ReactDOM.render(<Router routes={routes} history={createHistory()}/>, reactRoot);
