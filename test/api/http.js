import {expect} from 'chai';
import nock from 'nock';
import createHttpStrategy from '../../src/api/http';
import createContext from '../../src/context';

const baseUrl = 'http://localhost/';
const nakedPath = 'some/path';
const exampleResponse = {
  nakedPath,
  originalPath: nakedPath + '.md',
  data: {
    meta: {},
    html: '<p>I am HTML</p>',
  },
};

describe('Http strategy', () => {
  let context;
  let strategy;
  let scope;
  let nakedPathEndpoint;
  let contextEndpoint;

  beforeEach(() => {
    context = createContext();
    strategy = createHttpStrategy(baseUrl);
    scope = nock(baseUrl).persist();

    nakedPathEndpoint = scope.get('/' + nakedPath + '.json')
      .reply(200, exampleResponse);
    contextEndpoint = scope.get('/context.json')
      .reply(200, { siteMap: context.getSiteMap() });

    scope.get('/failpath').reply(404, 'oh man');
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('constructor', () => {
    it('throws if not given a baseUrl', () => {
      expect(() => {
        createHttpStrategy();
      }).to.throw();
    });
  });

  describe('getPageData', () => {
    it('returns a promise', () => {
      expect(strategy.getPageData(context)).to.be.instanceof(Promise);
    });

    it('rejects if not given a string `nakedPath`', (done) => {
      strategy.getPageData()
        .then(() => done('did not reject'))
        .catch(() => done());
    });

    it('calls nakedPath with .json extension', (done) => {
      strategy.getPageData(nakedPath)
        .then(() => {
          nakedPathEndpoint.isDone();
          done();
        })
        .catch(done);
    });

    it('returns correct JSON data', (done) => {
      strategy.getPageData(nakedPath)
        .then((data) => {
          expect(data).to.deep.equal(exampleResponse);
          done();
        })
        .catch(done);
    });

    it('rejects if there is an HTTP error', (done) => {
      strategy.getPageData('/failpath')
        .catch(() => done());
    });

    it('caches; fulfills all subsequent requests without re-fetching', () => {
      const promise1 = strategy.getPageData(nakedPath);
      const promise2 = strategy.getPageData(nakedPath);

      expect(promise1).to.equal(promise2);
    });
  });

  describe('getContext', () => {
    it('returns a promise', () => {
      expect(strategy.getContext()).to.be.instanceof(Promise);
    });

    it('requests context from baseUrl/context.json', (done) => {
      strategy.getContext()
        .then(() => {
          contextEndpoint.isDone();
          done();
        })
        .catch(done);
    });

    it('resolves correct data', (done) => {
      strategy.getContext()
        .then((resolvedContext) => {
          expect(resolvedContext.siteMap).to.deep.equal(context.getSiteMap());
          done();
        })
        .catch(done);
    });

    it('caches; fulfills all subsequent requests without re-fetching', () => {
      const promise1 = strategy.getContext();
      const promise2 = strategy.getContext();

      expect(promise1).to.equal(promise2);
    });
  });
});
