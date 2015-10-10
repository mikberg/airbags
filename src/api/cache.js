import {isContextOk} from '../context';

export default class CacheStrategy {
  getPageHtml(context, nakedPath) {
    return new Promise((resolve, reject) => {
      if (!isContextOk(context)) {
        return reject(`Expected a context, got ${context}`);
      }

      if (!this._isPageInContext(context, nakedPath)) {
        return reject(`Path ${nakedPath} is not in context`);
      }

      const page = this._getPageFromContext(context, nakedPath);
      if (page && page.data && page.data.html) {
        return resolve(page.data.html);
      }

      return reject(`Path ${nakedPath} does not have HTML in context`);
    });
  }

  _isPageInContext(context, nakedPath) {
    return nakedPath in context.siteMap;
  }

  _getPageFromContext(context, nakedPath) {
    return context.siteMap[nakedPath];
  }
}
