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
});
