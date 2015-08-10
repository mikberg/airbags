import { Provider } from 'react-redux';
import tasks from './src/tasks';
import createAirbagsStore from './src/createAirbagsStore';
import * as components from './src/components';

export default {
  tasks,
  createAirbagsStore,
  Provider,
  components
};
