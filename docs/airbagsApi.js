import { home, menu, config } from '../src/middleware';
import createApi from '../src/api';

const middleware = [
  home(),
  menu,
  config({ siteName: 'Airbags' }),
];

const strategies = [];
if (process.env.__BROWSER__) {
  strategies.push(require('../src/api/http')('/'));
} else {
  strategies.push(require('../src/api/cache')());
}

export default createApi(strategies, middleware);
