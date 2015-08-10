import {combineReducers, createStore} from 'redux';
import * as reducers from './reducers';

export default function createAirbagsStore() {
  let airbagsApp = combineReducers(reducers);
  return createStore(airbagsApp);
}
