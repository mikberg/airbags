import {expect} from 'chai';
import sinon from 'sinon';
import AirbagsApi, {isStrategyOk} from '../../src/api';
import {createContext} from '../../src/context';

class MockStrategy {
  dummyMethod() {
    return new Promise((resolve) => resolve());
  }
}

const context = createContext({});

describe('AirbagsApi', () => {
  describe('constructor', () => {
    it('throws if strategy is not a strategy', () => {
      expect(() => {
        /* eslint no-new:0 */
        new AirbagsApi(context, ['a']);
      }).to.throw();
    });

    it('internalizes strategies', () => {
      const strategy = new MockStrategy();
      const api = new AirbagsApi(context, [strategy]);
      expect(api.strategies).to.be.an('array');
      expect(api.strategies[0]).to.equal(strategy);
    });
  });

  describe('_applyToStrategies', () => {
    it('returns rejecting promise with no strategies', (done) => {
      const api = new AirbagsApi(context);
      api._applyToStrategies('noop')
        .catch(() => done());
    });

    it('calls method on strategies', (done) => {
      const strategy = new MockStrategy();
      sinon.spy(strategy, 'dummyMethod');

      const api = new AirbagsApi(context, [strategy]);
      api._applyToStrategies('dummyMethod')
        .then(() => {
          expect(strategy.dummyMethod.callCount).to.equal(1);
          done();
        });
    });

    it('calls strategies until resolving', (done) => {
      const strategy1 = new MockStrategy();
      const strategy2 = new MockStrategy();

      sinon.stub(strategy1, 'dummyMethod')
        .returns(new Promise((resolve, reject) => reject()));
      sinon.stub(strategy2, 'dummyMethod')
        .returns(new Promise((resolve) => resolve()));

      const api = new AirbagsApi(context, [strategy1, strategy2]);
      api._applyToStrategies('dummyMethod')
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

      const api = new AirbagsApi(context, [strategy1, strategy2]);
      api._applyToStrategies('dummyMethod')
        .catch(() => {
          expect(strategy1.dummyMethod.callCount).to.equal(1);
          expect(strategy2.dummyMethod.callCount).to.equal(1);
          done();
        });
    });
  });
});

describe('isStrategyOk', () => {
  it('returns false if not an object', () => {
    expect(isStrategyOk('a')).to.equal(false);
  });
});
