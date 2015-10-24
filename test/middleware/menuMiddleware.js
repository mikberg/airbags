import {expect} from 'chai';
import menu from '../../src/middleware/menuMiddleware';

const siteMap = {
  'in/menu': {
    nakedPath: 'in/menu',
    data: {
      meta: {
        title: 'InMenu',
        inMenu: true,
      },
    },
  },
};

const mockApi = {
  getContext() {
    return new Promise((resolve) => resolve({siteMap}));
  },
};

describe('menuMiddleware', () => {
  describe('api', () => {
    it('adds `getMenu` function to API', () => {
      menu.call(mockApi);
      expect(mockApi.getMenu).to.be.a('function');
    });

    it('returns `[title->nakedPath]` array for pages with `inMenu=true and title set`', (done) => {
      menu.call(mockApi);
      mockApi.getMenu()
        .then((_menu) => {
          expect(_menu).to.contain({'InMenu': 'in/menu'});
          done();
        })
        .catch(done);
    });

    it('can handle pages without meta', (done) => {
      const dumbSiteMap = {'dumb': {}};
      const dumbApi = {
        getContext() {
          return new Promise((resolve) => resolve({siteMap: dumbSiteMap}));
        },
      };

      menu.call(dumbApi);
      dumbApi.getMenu()
        .then((_menu) => {
          expect(_menu).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
});
