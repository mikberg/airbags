import {isContextOk} from '../context';
import stripOuter from 'strip-outer';
import 'isomorphic-fetch';

/**
 * @NOTE: Could require URL to be set on context?
 */
export default class HttpStrategy {
  constructor(baseUrl) {
    if (typeof baseUrl !== 'string') {
      throw new Error(`HttpStrategy expected a baseUrl, got ${baseUrl}`);
    }

    this.baseUrl = this._stripBaseUrl(baseUrl);
  }

  getPageData(context, nakedPath) {
    return new Promise((resolve, reject) => {
      if (!isContextOk(context)) {
        return reject(new Error(`getPageData expected a context, got ${context}`));
      }

      if (typeof nakedPath !== 'string') {
        return reject(new Error(`getPageData expected a string nakedPath`));
      }

      const url = this._getUrl(nakedPath);
      fetch(url)
        .then((response) => {
          if (response.status !== 200) {
            return reject(new Error(`HttpStrategy error: ${response.status} returned`));
          }

          return response.json();
        })
        .then((data) => {
          return resolve(data);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  getPageHtml(context, nakedPath) {
    return this.getPageData(context, nakedPath)
      .then(({data}) => {
        return data.html;
      });
  }

  _getUrl(nakedPath) {
    return `${this.baseUrl}${nakedPath}.json`;
  }

  _stripBaseUrl(baseUrl) {
    return stripOuter(baseUrl, '/');
  }
}
