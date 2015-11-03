import {isContextOk} from '../context';

function isPageInContext(context, nakedPath) {
  return nakedPath in context.getSiteMap();
}

function getPageFromContext(context, nakedPath) {
  return context.getSiteMap()[nakedPath];
}

function cacheStrategyModel(loadedContext) {
  this.context = loadedContext;

  this.setContext = (context) => {
    if (this.context) {
      throw new Error(`Expected a context, got ${context}`);
    }

    if (!isContextOk(context)) {
      throw new Error(`Expected a context, got ${context}`);
    }

    this.context = context;
  };

  this.getPageData = (nakedPath) => {
    return this.getContext().then((context) => {
      if (!isPageInContext(context, nakedPath)) {
        throw new Error(`Path ${nakedPath} is not in context`);
      }

      const page = getPageFromContext(context, nakedPath);
      if (page && page.data) {
        return page.data;
      }

      throw new Error(`Path ${nakedPath} does not have data in context`);
    });
  };

  this.getContext = (context) => {
    return new Promise((resolve, reject) => {
      if (context && !isContextOk(context)) {
        return reject(`Expected a context, got ${context}`);
      }

      if (!context && this.context) {
        return resolve(this.context);
      }

      if (!context && !this.context) {
        return reject(new Error(`No context available`));
      }

      return resolve(context);
    });
  };
}

export default function createCacheStrategy(context) {
  const strategy = {};

  if (typeof context === 'object' && !isContextOk(context)) {
    throw new Error(`Expected argument to be a context or undefined, got ${context}`);
  }

  cacheStrategyModel.call(strategy, context);
  return strategy;
}
