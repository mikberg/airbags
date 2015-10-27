import {expect} from 'chai';
import {
  createContext,
  isContextOk,
} from '../../src/context';

const addPageName = (state) => Object.assign(state,
  { configuration: { pageName: 'CoolPage' }});
addPageName.contextAugmenter = function addPageNameAugmenter(state) {
  this.getPageName = () => state.configuration.pageName;
};

describe('createContext', () => {
  it('throws if not given a plausible `siteMap`', () => {
    const fakeMap = {
      a: {},
    };

    expect(() => {
      createContext(fakeMap);
    }).to.throw();
  });

  it('throws if configuration is not an object', () => {
    expect(() => {
      createContext({}, 1);
    }).to.throw();
  });

  it('returns a context containing `getSiteMap`', () => {
    const siteMap = {};
    expect(createContext().getSiteMap).to.be.a('function');
    expect(createContext({siteMap}).getSiteMap()).to.equal(siteMap);
  });

  it('has sitemap readily available', () => {
    const context = createContext();
    expect(context.siteMap).to.be.an('object');
  });
});

describe('contextModel', () => {
  describe('copy', () => {
    it('returns a copy of the context', () => {
      const state = { siteMap: {}, configuration: { a: 'b' } };
      const context = createContext(state);
      expect(context.copy()).to.contain(state);
    });
  });

  describe('getSiteMap', () => {
    it('returns the state `siteMap`', () => {
      const state = { siteMap: {} };
      const context = createContext(state);
      expect(context.getSiteMap()).to.equal(state.siteMap);
    });
  });
});

describe('isContextOk', () => {
  it('returns false if given a non-plausible context', () => {
    expect(isContextOk({})).to.equal(false);
  });

  it('returns true if given a plausible context', () => {
    expect(isContextOk(createContext())).to.equal(true);
  });
});
