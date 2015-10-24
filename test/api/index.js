import {expect} from 'chai';
import sinon from 'sinon';
import createApi, {applyToStrategies, isStrategyOk} from '../../src/api';
import createCacheStrategy from '../../src/api/cache';
import {createContext} from '../../src/context';

class MockStrategy {
  dummyMethod() {
    return new Promise((resolve) => resolve());
  }

  getPageHtml() {}
  getPageData() {}
  getContext() {}
}

const context = createContext();

describe('createApi', () => {
  it('throws if strategy is not a strategy', () => {
    expect(() => {
      createApi(context, ['a']);
    }).to.throw();
  });

  it('attaches middleware apis', (done) => {
    const siteMap = {
      'some/path': {
        nakedPath: 'some/path',
        originalPath: 'some/path.md',
        data: {
          html: '<p>hei</p>',
        },
      },
    };

    const backwardsMiddleware = function backwards() {
      this.getBackwardsHtml = (nakedPath) => {
        return this.getPageData(nakedPath).then((data) => {
          return data.html.split('').reverse().join('');
        });
      };
    };

    const someContext = createContext({siteMap});
    const api = createApi([createCacheStrategy(someContext)], [backwardsMiddleware]);

    api.getBackwardsHtml('some/path')
      .then((backwards) => {
        expect(backwards).to.equal('>p/<ieh>p<');
        done();
      })
      .catch(done);
  });

  it('can work without being given a context', (done) => {
    const coolStrategy = {
      getContext() {
        return new Promise((resolve) => resolve({ siteMap: {}}));
      },
    };

    createApi([coolStrategy]).getContext()
      .then((cont) => {
        expect(cont.siteMap).to.be.an('object');
        done();
      })
      .catch(done);
  });
});

describe('getPageData', () => {
  it('calls strategies with `nakedPath`', (done) => {
    const nakedPath = 'cool/page';
    const strategy = new MockStrategy();
    sinon.stub(strategy, 'getPageData')
      .returns(new Promise((resolve) => resolve()));

    const api = createApi([strategy]);
    api.getPageData(nakedPath).then(() => {
      expect(strategy.getPageData.calledWith(nakedPath)).to.equal(true);
      done();
    }).catch(done);
  });

  it('resolves to strategy\'s resolve', (done) => {
    const nakedPath = 'cool/page';
    const data = { hei: 'hopp' };
    const strategy = new MockStrategy();
    sinon.stub(strategy, 'getPageData')
      .returns(new Promise((resolve) => resolve(data)));

    const api = createApi([strategy]);
    api.getPageData(nakedPath).then((returnedData) => {
      expect(returnedData).to.deep.equal(data);
      done();
    }).catch(done);
  });
});

describe('getContext', () => {
  it('calls strategies', (done) => {
    const strategy = new MockStrategy();
    sinon.stub(strategy, 'getContext')
      .returns(new Promise((resolve) => resolve()));

    const api = createApi(context, [strategy]);
    api.getContext().then(() => {
      expect(strategy.getContext.called).to.equal(true);
      done();
    }).catch(done);
  });
});

describe('isStrategyOk', () => {
  it('returns false if not an object', () => {
    expect(isStrategyOk('a')).to.equal(false);
  });
});

describe('applyToStrategies', () => {
  it('returns rejecting promise with no strategies', (done) => {
    applyToStrategies([], 'dummyMethod', [])
      .catch(() => done());
  });

  it('calls method on strategies', (done) => {
    const strategy = new MockStrategy();
    sinon.spy(strategy, 'dummyMethod');

    applyToStrategies([strategy], 'dummyMethod', [])
      .then(() => {
        expect(strategy.dummyMethod.callCount).to.equal(1);
        done();
      });
  });

  it('calls method with arguments', (done) => {
    const strategy = new MockStrategy();
    sinon.spy(strategy, 'dummyMethod');

    applyToStrategies([strategy], 'dummyMethod', ['a', 1, Math.PI])
      .then(() => {
        expect(strategy.dummyMethod.calledWith('a', 1, Math.PI))
          .to.equal(true);
        done();
      }).catch(done);
  });

  it('calls strategies until resolving', (done) => {
    const strategy1 = new MockStrategy();
    const strategy2 = new MockStrategy();

    sinon.stub(strategy1, 'dummyMethod')
      .returns(new Promise((resolve, reject) => reject()));
    sinon.stub(strategy2, 'dummyMethod')
      .returns(new Promise((resolve) => resolve()));

    applyToStrategies([strategy1, strategy2], 'dummyMethod', [])
      .then(() => {
        expect(strategy1.dummyMethod.callCount).to.equal(1);
        expect(strategy2.dummyMethod.callCount).to.equal(1);
        done();
      });
  });

  it('rejects if no strategies resolve', (done) => {
    const strategy1 = new MockStrategy();
    const strategy2 = new MockStrategy();

    sinon.stub(strategy1, 'dummyMethod')
      .returns(new Promise((resolve, reject) => reject()));
    sinon.stub(strategy2, 'dummyMethod')
      .returns(new Promise((resolve, reject) => reject()));

    applyToStrategies([strategy1, strategy2], 'dummyMethod', [])
      .catch(() => {
        expect(strategy1.dummyMethod.callCount).to.equal(1);
        expect(strategy2.dummyMethod.callCount).to.equal(1);
        done();
      });
  });
});
