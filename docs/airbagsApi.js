import menu from '../src/middleware/menu';
import createConfig from '../src/middleware/config';
import createApi from '../src/api';
import createCacheStrategy from '../src/api/cache';

export default function api(context) {
  const middleware = [
    menu,
    createConfig({ siteName: 'Airbags Docs' }),
  ];

  const strategies = [
    createCacheStrategy(context),
  ];

  return createApi(strategies, middleware);
}
