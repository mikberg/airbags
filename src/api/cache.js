import {isContextOk} from '../context';

function isPageInContext(context, nakedPath) {
  return nakedPath in context.getSiteMap();
}

function getPageFromContext(context, nakedPath) {
  return context.getSiteMap()[nakedPath];
}

function cacheStrategyModel() {
  this.getPageData = (context, nakedPath) => {
    return new Promise((resolve, reject) => {
      if (!isContextOk(context)) {
        return reject(`Expected a context, got ${context}`);
      }

      if (!isPageInContext(context, nakedPath)) {
        return reject(`Path ${nakedPath} is not in context`);
      }

      const page = getPageFromContext(context, nakedPath);
      if (page && page.data) {
        return resolve(page.data);
      }

      return reject(`Path ${nakedPath} does not have data in context`);
    });
  };

  this.getPageHtml = (context, nakedPath) => {
    return this.getPageData(context, nakedPath)
      .then((data) => {
        if (!data.html) {
          throw new Error(`No HTML in data for ${nakedPath}`);
        }
        return data.html;
      });
  };

  this.getContext = (context) => {
    return new Promise((resolve, reject) => {
      if (!isContextOk(context)) {
        return reject(`Expected a context, got ${context}`);
      }

      return resolve(context);
    });
  };
}

export default function createCacheStrategy() {
  const strategy = {};
  cacheStrategyModel.call(strategy);
  return strategy;
}
