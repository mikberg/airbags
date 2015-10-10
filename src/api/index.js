import {isContextOk} from '../context';

export function isStrategyOk(strategy) {
  return typeof strategy === 'object';
}

export default class AirbagsApi {
  constructor(context, strategies = []) {
    if (strategies.some((strategy) => !isStrategyOk(strategy))) {
      throw new Error(`AirbagsApi expected array of strategies, got ${strategies}`);
    }

    if (!isContextOk(context)) {
      throw new Error(`AirbagsApi expected context, got ${context}`);
    }

    this.strategies = strategies;
    this.context = context;
  }

  /**
   * Fetch the HTML for a page, from its' `nakedPath`
   */
  getPageHtml(nakedPath) {
    return this._applyToStrategies('getPageHtml', nakedPath);
  }

  /**
   * Run a method on strategies in order until one of them resolves. Reject if
   * no strategies resolve.
   */
  _applyToStrategies(methodName, ...args) {
    return new Promise((resolve, reject) => {
      if (this.strategies.length === 0) {
        reject(new Error(`No strategies to use for ${methodName}`));
      }

      const apply = (iterator) => {
        if (iterator === this.strategies.length) {
          reject(`No strategies could resolve ${methodName}`);
        }

        this.strategies[iterator][methodName](...args)
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            apply(iterator + 1);
          });
      };

      apply(0);
    });
  }
}
