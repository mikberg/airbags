import {expect} from 'chai';
import sinon from 'sinon';
import createCacheStrategy from '../../src/api/cache';
import {createContext} from '../../src/context';

const siteMap = {
  '/naked/path': {
    nakedPath: '/naked/path',
    originalPath: '/naked/path.md',
    data: {
      html: '<p>hei</p>',
    },
  },
  '/path/without/html': {
    nakedPath: '/path/without/html',
    originalPath: '/path/without/html.md',
    data: {},
  },
};

describe('Cache strategy', () => {
  describe('constructor', () => {
    it('needs no arguments', () => {
      expect(() => {
        createCacheStrategy();
      }).not.to.throw();
    });

    it('throws if given an object which is not a context', () => {
      expect(() => {
        createCacheStrategy({});
      }).to.throw();
    });
  });

  describe('setContext', () => {
    it('throws if given an object which is not a context', () => {
      const strategy = createCacheStrategy();
      expect(() => {
        strategy.setContext({});
      }).to.throw();
    });

    it('throws if context is already set', () => {
      const context = createContext({siteMap});
      const strategy = createCacheStrategy(context);
      expect(() => {
        strategy.setContext(context);
      }).to.throw();
    });

    it('causes the strategy to return that context from `getContext`', (done) => {
      const context = createContext({siteMap});
      const strategy = createCacheStrategy();
      strategy.setContext(context);
      strategy.getContext().then(con => {
        expect(con.siteMap).to.deep.equal(con.siteMap);
        done();
      }).catch(done);
    });
  });

  describe('getPageData', () => {
    let context;
    let strategy;
    beforeEach(() => {
      context = createContext({siteMap});
      strategy = createCacheStrategy();
      sinon.stub(strategy, 'getContext')
        .returns(new Promise((resolve) => resolve(context)));
    });

    it('returns a promise', () => {
      expect(strategy.getPageData().then).to.be.a('function');
    });

    it('rejects if not given a string `nakedPath`', (done) => {
      strategy.getPageData()
        .then(() => done('did not throw'))
        .catch(() => done());
    });

    it('resolves to path\'s data', (done) => {
      strategy.getPageData('/naked/path')
        .then((html) => {
          expect(html).to.deep.equal(context.getSiteMap()['/naked/path'].data);
          done();
        }).catch(done);
    });

    it('rejects if given unknown path', (done) => {
      strategy.getPageData('/unknown/url').catch(() => {
        done();
      });
    });
  });

  describe('getContext', () => {
    let context;
    let strategy;
    beforeEach(() => {
      context = createContext({siteMap});
      strategy = createCacheStrategy();
    });

    it('rejects if not given a context and no loaded context', (done) => {
      strategy.getContext()
        .then(() => done('did not reject'))
        .catch(() => done());
    });

    it('returns a promise', () => {
      expect(strategy.getContext(context).then).to.be.a('function');
    });

    it('resolves to the context given', (done) => {
      strategy.getContext(context)
        .then((resolvedContext) => {
          expect(resolvedContext).to.equal(context);
          done();
        }).catch(done);
    });

    it('resolves to context in factory if given', (done) => {
      const givenContext = createContext({siteMap});
      const loadedStrategy = createCacheStrategy(givenContext);

      loadedStrategy.getContext().then((resolvedContext) => {
        expect(resolvedContext).to.equal(givenContext);
        done();
      }).catch(done);
    });
  });
});
