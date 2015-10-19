import {expect} from 'chai';
import nock from 'nock';
import createHttpStrategy from '../../src/api/http';
import {createContext} from '../../src/context';

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

  beforeEach(() => {
    context = createContext();
    strategy = createHttpStrategy(baseUrl);
    scope = nock(baseUrl);

    nakedPathEndpoint = scope.get('/' + nakedPath + '.json')
      .reply(200, exampleResponse);

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
      strategy.getPageData(context)
        .then(() => done('did not reject'))
        .catch(() => done());
    });

    it('calls nakedPath with .json extension', (done) => {
      strategy.getPageData(context, nakedPath)
        .then(() => {
          nakedPathEndpoint.isDone();
          done();
        })
        .catch(done);
    });

    it('returns correct JSON data', (done) => {
      strategy.getPageData(context, nakedPath)
        .then((data) => {
          expect(data).to.deep.equal(exampleResponse);
          done();
        })
        .catch(done);
    });

    it('rejects if there is an HTTP error', (done) => {
      strategy.getPageData(context, '/failpath')
        .catch(() => done());
    });
  });

  describe('getPageHtml', () => {
    it('returns a promise', () => {
      expect(strategy.getPageHtml(context).then).to.be.a('function');
    });

    it('rejects if not given a string `nakedPath`', (done) => {
      strategy.getPageHtml(context)
        .then(() => done('did not throw'))
        .catch(() => done());
    });

    it('calls nakedPath with .json extension', (done) => {
      strategy.getPageHtml(context, nakedPath)
        .then(() => {
          nakedPathEndpoint.isDone();
          done();
        }).catch(done);
    });

    it('returns HTML from the JSON data', (done) => {
      strategy.getPageHtml(context, nakedPath)
        .then((html) => {
          expect(html).to.equal('<p>I am HTML</p>');
          done();
        }).catch(done);
    });

    it('rejects if there is an HTTP error', (done) => {
      strategy.getPageHtml(context, '/failpath')
        .catch(() => done());
    });
  });
});
