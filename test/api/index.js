import {expect} from 'chai';
import sinon from 'sinon';
import createApi, {applyToStrategies, isStrategyOk} from '../../src/api';
import {createContext} from '../../src/context';

class MockStrategy {
  dummyMethod() {
    return new Promise((resolve) => resolve());
  }

  getPageHtml() {}
  getPageData() {}
}

const context = createContext();

describe('createApi', () => {
  it('throws if not given a context', () => {
    expect(() => {
      createApi('context', []);
    }).to.throw();
  });

  it('throws if strategy is not a strategy', () => {
    expect(() => {
      createApi(context, ['a']);
    }).to.throw();
  });
});

describe('getPageHtml', () => {
  it('warns that the method is deprecated', () => {
    const api = createApi(context);
    const spy = sinon.spy(console, 'warn');
    api.getPageHtml('cool/page');
    expect(spy.callCount).to.equal(1);
  });

  it('returns a promise', () => {
    const api = createApi(context);
    expect(api.getPageHtml('/cool/page').then).to.be.a('function');
  });

  it('calls strategies with context and `nakedPath`', (done) => {
    const nakedPath = '/cool/page';
    const strategy = new MockStrategy();
    sinon.stub(strategy, 'getPageHtml')
      .returns(new Promise((resolve) => resolve()));

    const api = createApi(context, [strategy]);
    api.getPageHtml(nakedPath).then(() => {
      expect(strategy.getPageHtml.calledWith(context, nakedPath)).to.equal(true);
      done();
    }).catch(done);
  });

  it('resolves to strategy\'s resolve', (done) => {
    const html = 'hei';
    const strategy = new MockStrategy();
    sinon.stub(strategy, 'getPageHtml')
      .returns(new Promise(resolve => resolve(html)));

    const api = createApi(context, [strategy]);
    api.getPageHtml('/path')
      .then((resolvedHtml) => {
        expect(resolvedHtml).to.equal(html);
        done();
      }).catch(done);
  });
});

describe('getPageData', () => {
  it('calls strategies with context and `nakedPath`', (done) => {
    const nakedPath = 'cool/page';
    const strategy = new MockStrategy();
    sinon.stub(strategy, 'getPageData')
      .returns(new Promise((resolve) => resolve()));

    const api = createApi(context, [strategy]);
    api.getPageData(nakedPath).then(() => {
      expect(strategy.getPageData.calledWith(context, nakedPath)).to.equal(true);
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
