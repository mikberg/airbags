import {isContextOk} from '../context';

/**
 * Run a method on strategies in order until one of them resolves. Reject if
 * no strategies resolve.
 */
export function applyToStrategies(strategies, methodName, args) {
  return new Promise((resolve, reject) => {
    if (strategies.length === 0) {
      return reject(new Error(`No strategies to use for ${methodName}`));
    }

    const apply = (iterator) => {
      if (iterator === strategies.length) {
        return reject(`No strategies could resolve ${methodName} for arguments ${args}`);
      }

      strategies[iterator][methodName](...args)
        .then((data) => {
          return resolve(data);
        }).catch(() => {
          apply(iterator + 1);
        });
    };

    apply(0);
  });
}

function apiModel(context, strategies) {
  this.getPageData = (nakedPath) => {
    return applyToStrategies(strategies, 'getPageData', [context, nakedPath]);
  };

  this.getPageHtml = (nakedPath) => {
    /* eslint no-console:0 */
    console.warn(`api.getPageHtml is deprecated, please use getPageData instead`);
    return applyToStrategies(strategies, 'getPageHtml', [context, nakedPath]);
  };
}

export function isStrategyOk(strategy) {
  return typeof strategy === 'object';
}

export default function createApi(context, strategies = []) {
  if (strategies.some((strategy) => !isStrategyOk(strategy))) {
    throw new Error(`createApi expected array of strategies, got ${strategies}`);
  }

  if (!isContextOk(context)) {
    throw new Error(`createApi expected context, got ${context}`);
  }

  const api = {};
  apiModel.call(api, context, strategies);
  return api;
}
