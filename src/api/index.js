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

function apiModel(strategies, middleware) {
  this.strategies = {};

  this.getPageData = (nakedPath) => {
    return applyToStrategies(strategies, 'getPageData', [nakedPath]);
  };

  this.getContext = () => {
    return applyToStrategies(strategies, 'getContext', [])
      .then(raw => {
        middleware.forEach((mid) => {
          if (!mid.name) {
            throw new Error(`Middleware must be named functions`);
          }

          if (typeof mid.amendContext === 'function' && !raw[mid.name]) {
            raw[mid.name] = mid.amendContext(raw);
          }
        });

        return raw;
      });
  };
}

export function isStrategyOk(strategy) {
  return typeof strategy === 'function' && strategy.name;
}

export default function createApi(strategies = [], middleware = []) {
  if (strategies.some((strategy) => !isStrategyOk(strategy))) {
    throw new Error(`createApi expected array of strategies, got ${strategies}`);
  }

  const api = {};
  apiModel.call(api, strategies, middleware);

  middleware
    .forEach((mid) => {
      mid.call(api);
    });

  strategies.forEach(strategy => {
    api.strategies[strategy.name] = strategy;
  });

  return api;
}
