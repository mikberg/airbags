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
    return applyToStrategies(strategies, 'getPageData', [nakedPath]);
  };

  this.getContext = () => {
    return applyToStrategies(strategies, 'getContext', []);
  };
}

export function isStrategyOk(strategy) {
  return typeof strategy === 'object';
}

export default function createApi(_context, _strategies = [], _middleware = []) {
  let context;
  let strategies;
  let middleware;

  if (Array.isArray(_context)) {
    strategies = _context;
    middleware = _strategies;
  } else {
    context = _context;
    strategies = _strategies;
    middleware = _middleware;
  }

  if (typeof context === 'object' && !isContextOk(context)) {
    throw new Error(`createApi expected context, got ${context}`);
  }

  if (strategies.some((strategy) => !isStrategyOk(strategy))) {
    throw new Error(`createApi expected array of strategies, got ${strategies}`);
  }

  const api = {};
  apiModel.call(api, context, strategies);

  middleware
    .forEach((mid) => {
      mid.call(api);
    });

  return api;
}
