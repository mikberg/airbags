import {isContextOk} from '../context';

export default class CacheStrategy {
  getPageData(context, nakedPath) {
    return new Promise((resolve, reject) => {
      if (!isContextOk(context)) {
        return reject(`Expected a context, got ${context}`);
      }

      if (!this._isPageInContext(context, nakedPath)) {
        return reject(`Path ${nakedPath} is not in context`);
      }

      const page = this._getPageFromContext(context, nakedPath);
      if (page && page.data) {
        return resolve(page.data);
      }

      return reject(`Path ${nakedPath} does not have HTML in context`);
    });
  }

  getPageHtml(context, nakedPath) {
    return this.getPageData(context, nakedPath)
      .then((data) => {
        if (!data.html) {
          throw new Error(`No HTML in data for ${nakedPath}`);
        }
        return data.html;
      });
  }

  _isPageInContext(context, nakedPath) {
    return nakedPath in context.getSiteMap();
  }

  _getPageFromContext(context, nakedPath) {
    return context.getSiteMap()[nakedPath];
  }
}
