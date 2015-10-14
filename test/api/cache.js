import {expect} from 'chai';
import CacheStrategy from '../../src/api/cache';
import {createContext} from '../../src/context';

describe('Cache strategy', () => {
  describe('constructor', () => {
    it('needs no arguments', () => {
      expect(() => {
        /* eslint no-new:0 */
        new CacheStrategy();
      }).not.to.throw();
    });
  });

  describe('getPageData', () => {
    let context;
    let strategy;
    beforeEach(() => {
      context = createContext({
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
      });
      strategy = new CacheStrategy();
    });

    it('rejects if not given a context', (done) => {
      strategy.getPageData()
        .then(() => done('did not throw'))
        .catch(() => done());
    });

    it('returns a promise', () => {
      expect(strategy.getPageData().then).to.be.a('function');
    });

    it('rejects if not given a string `nakedPath`', (done) => {
      strategy.getPageData(context)
        .then(() => done('did not throw'))
        .catch(() => done());
    });

    it('resolves to path\'s data', (done) => {
      strategy.getPageData(context, '/naked/path')
        .then((html) => {
          expect(html).to.deep.equal(context.getSiteMap()['/naked/path'].data);
          done();
        }).catch(done);
    });

    it('rejects if given unknown path', (done) => {
      strategy.getPageHtml(context, '/unknown/url').catch(() => {
        done();
      });
    });
  });

  describe('getPageHtml', () => {
    let context;
    let strategy;
    beforeEach(() => {
      context = createContext({
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
      });
      strategy = new CacheStrategy();
    });

    it('rejects if not given a context', (done) => {
      strategy.getPageHtml()
        .then(() => done('did not throw'))
        .catch(() => done());
    });

    it('returns a promise', () => {
      expect(strategy.getPageHtml().then).to.be.a('function');
    });

    it('rejects if not given a string `nakedPath`', (done) => {
      strategy.getPageHtml(context)
        .then(() => done('did not throw'))
        .catch(() => done());
    });

    it('resolves to path\'s html', (done) => {
      strategy.getPageHtml(context, '/naked/path')
        .then((html) => {
          expect(html).to.equal(context.getSiteMap()['/naked/path'].data.html);
          done();
        }).catch(done);
    });

    it('rejects if given unknown path', (done) => {
      strategy.getPageHtml(context, '/unknown/url').catch(() => {
        done();
      });
    });

    it('rejects if given path with no html in context', (done) => {
      strategy.getPageHtml(context, '/path/without/html').catch(() => {
        done();
      });
    });
  });
});
