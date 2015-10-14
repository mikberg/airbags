import {expect} from 'chai';
import {
  createContext,
  isContextOk,
  applyMiddleware,
} from '../../src/context';

const addPageName = (state) => Object.assign(state,
  { configuration: { pageName: 'CoolPage' }});

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

  it('applies middleware to the state', () => {
    const context = createContext(undefined, [addPageName]);
    expect(context.getConfiguration().pageName).to.equal('CoolPage');
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

describe('applyMiddleware', () => {
  it('throws if not given a state', () => {
    expect(() => {
      applyMiddleware(2, []);
    }).to.throw();
  });

  it('throws if not given an array of middleware', () => {
    expect(() => {
      applyMiddleware({});
    }).to.throw();
  });

  it('runs the state through middleware', () => {
    const state = applyMiddleware({}, [addPageName]);
    expect(state.configuration.pageName).to.equal('CoolPage');
  });

  it('does not manipulate the state', () => {
    const state = {};
    expect(applyMiddleware(state, [addPageName])).not.to.equal(state);
  });

  it('returns a copy of the state if no middleware is given', () => {
    const state = { a: 'b' };
    expect(applyMiddleware(state, [])).to.deep.equal(state);
    expect(applyMiddleware(state, [])).not.to.equal(state);
  });
});
