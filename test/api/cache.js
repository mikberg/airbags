import {expect} from 'chai';
import CacheStrategy from '../../src/api/cache';
import {createContext} from '../../src/context';

describe('Cache strategy', () => {
  describe('constructor', () => {
    it('throws if not given a context', () => {
      expect(() => {
        /* eslint no-new:0 */
        new CacheStrategy({});
      }).to.throw();
    });

    it('saves a copy of the context', () => {
      const context = createContext({});
      const strategy = new CacheStrategy(context);
      expect(strategy.context).to.equal(context);
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
      strategy = new CacheStrategy(context);
    });

    it('returns a promise', () => {
      expect(strategy.getPageHtml().then).to.be.a('function');
    });

    it('rejects if not given a string `nakedPath`', (done) => {
      strategy.getPageHtml()
        .then(() => done('did not throw'))
        .catch(() => done());
    });

    it('resolves to path\'s html', (done) => {
      strategy.getPageHtml('/naked/path')
        .then((html) => {
          expect(html).to.equal(context.siteMap['/naked/path'].data.html);
          done();
        }).catch(done);
    });

    it('rejects if given unknown path', (done) => {
      strategy.getPageHtml('/unknown/url').catch(() => {
        done();
      });
    });

    it('rejects if given path with no html in context', (done) => {
      strategy.getPageHtml('/path/without/html').catch(() => {
        done();
      });
    });
  });
});
