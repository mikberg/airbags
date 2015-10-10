import {expect} from 'chai';
import nock from 'nock';
import HttpStrategy from '../../src/api/http';
import {createContext} from '../../src/context';

describe('Http strategy', () => {
  describe('constructor', () => {
    it('throws if not given a context', () => {
      expect(() => {
        /* eslint no-new:0 */
        new HttpStrategy(undefined, 'http://localhost/');
      }).to.throw();
    });

    it('throws if not given a baseUrl', () => {
      expect(() =>{
        /* eslint no-new:0 */
        new HttpStrategy(createContext({}));
      }).to.throw();
    });

    it('saves baseUrl without trailing slash', () => {
      const context = createContext({});
      const strategy = new HttpStrategy(context, 'http://localhost/');
      expect(strategy.baseUrl).to.equal('http://localhost');
    });

    it('saves a copy of the context', () => {
      const context = createContext({});
      const strategy = new HttpStrategy(context, '');
      expect(strategy.context).to.equal(context);
    });
  });

  describe('getPageHtml', () => {
    const baseUrl = 'http://localhost/';
    const nakedPath = '/some/path';
    let context;
    let strategy;
    let scope;
    let nakedPathEndpoint;
    beforeEach(() => {
      context = createContext({});
      strategy = new HttpStrategy(context, baseUrl);
      scope = nock(baseUrl);

      nakedPathEndpoint = scope.get(nakedPath + '.json').reply(200, {
        nakedPath,
        originalPath: nakedPath + '.md',
        data: {
          meta: {},
          html: '<p>I am HTML</p>',
        },
      });

      scope.get('/failpath').reply(404, 'oh man');
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('returns a promise', () => {
      expect(strategy.getPageHtml().then).to.be.a('function');
    });

    it('rejects if not given a string `nakedPath`', (done) => {
      strategy.getPageHtml()
        .then(() => done('did not throw'))
        .catch(() => done());
    });

    it('calls nakedPath with .json extension', (done) => {
      strategy.getPageHtml(nakedPath)
        .then(() => {
          nakedPathEndpoint.isDone();
          done();
        }).catch(done);
    });

    it('returns HTML from the JSON data', (done) => {
      strategy.getPageHtml(nakedPath)
        .then((html) => {
          expect(html).to.equal('<p>I am HTML</p>');
          done();
        }).catch(done);
    });

    it('rejects if there is an HTTP error', (done) => {
      strategy.getPageHtml('/failpath')
        .catch(() => done());
    });
  });
});
