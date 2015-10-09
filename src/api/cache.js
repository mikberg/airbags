import {isContextOk} from '../context';

export default class CacheStrategy {
  constructor(context) {
    if (!isContextOk(context)) {
      throw new Error(`CacheStrategy expected context, got ${context}`);
    }

    this.context = context;
  }

  getPageHtml(nakedPath) {
    return new Promise((resolve, reject) => {
      if (!this._isPageInContext(nakedPath)) {
        return reject(`Path ${nakedPath} is not in context`);
      }

      const page = this._getPageFromContext(nakedPath);
      if (page && page.data && page.data.html) {
        return resolve(page.data.html);
      }

      return reject(`Path ${nakedPath} does not have HTML in context`);
    });
  }

  _isPageInContext(nakedPath) {
    return nakedPath in this.context.siteMap;
  }

  _getPageFromContext(nakedPath) {
    return this.context.siteMap[nakedPath];
  }
}
