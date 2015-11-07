import menu from '../src/middleware/menu';
import home from '../src/middleware/home';
import createConfig from '../src/middleware/config';
import createApi from '../src/api';

const middleware = [
  home(),
  menu,
  createConfig({ siteName: 'Airbags' }),
];

const strategies = [];
if (process.env.__BROWSER__) {
  strategies.push(require('../src/api/http')('/'));
} else {
  strategies.push(require('../src/api/cache')());
}

export default createApi(strategies, middleware);
