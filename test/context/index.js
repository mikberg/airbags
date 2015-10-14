import {expect} from 'chai';
import {createContext, isContextOk} from '../../src/context';

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

  it('returns a context containing `getConfiguration`', () => {
    expect(createContext().getConfiguration).to.be.a('function');
  });
});

describe('contextModel', () => {
  describe('copy', () => {
    it('returns a copy of the context', () => {
      const state = { siteMap: {}, configuration: { a: 'b' } };
      const context = createContext(state);
      expect(context.copy().getConfiguration())
        .to.deep.equal(state.configuration);
    });
  });

  describe('getSiteMap', () => {
    it('returns the state `siteMap`', () => {
      const state = { siteMap: {} };
      const context = createContext(state);
      expect(context.getSiteMap()).to.equal(state.siteMap);
    });
  });

  describe('getConfiguration', () => {
    it('returns the state `configuration`', () => {
      const state = { siteMap: {}, configuration: { a: 'b' }};
      const context = createContext(state);
      expect(context.getConfiguration()).to.equal(state.configuration);
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
