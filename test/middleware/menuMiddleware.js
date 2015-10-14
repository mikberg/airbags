import {expect} from 'chai';
import menuMiddleware from '../../src/middleware/menuMiddleware';

const siteMap = {
  'in/menu': {
    nakedPath: 'in/menu',
    meta: {
      title: 'InMenu',
      inMenu: true,
    },
  },
};

describe('menuMiddleware', () => {
  it('adds `menu` chapter to state', () => {
    const state = menuMiddleware({ siteMap: {} });
    expect(state.menu).to.deep.equal([]);
  });

  it('adds `[title->nakedPath]` array for pages with `inMenu=true` and title set', () => {
    const {menu} = menuMiddleware({siteMap});
    expect(menu).to.contain({'InMenu': 'in/menu'});
  });

  it('can handle pages without meta', () => {
    const dumbSiteMap = {'dumb': {}};
    expect(() => {
      menuMiddleware({siteMap: dumbSiteMap});
    }).not.to.throw();
  });

  describe('contextAugmenter', () => {
    const state = menuMiddleware({ siteMap: {} });
    const context = {};
    menuMiddleware.contextAugmenter.call(context, state);

    it('adds `getMenu`', () => {
      expect(context.getMenu).to.be.a('function');
    });

    it('returns menu from `getMenu`', () => {
      expect(context.getMenu()).to.be.an('array');
    });
  });
});
