import {isContextOk} from '../context';
import request from 'request';
import stripOuter from 'strip-outer';

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

  getPageData() {
    return new Promise((resolve, reject) => {
      return reject(new Error(`getPageData not yet implemented for HttpStrategy`));
    });
  }

  getPageHtml(context, nakedPath) {
    return new Promise((resolve, reject) => {
      if (!isContextOk(context)) {
        return reject(new Error('getPageHtml expected a context, got ${context}'));
      }

      if (typeof nakedPath !== 'string') {
        return reject(new Error('getPageHtml expected a string `nakedPath`'));
      }

      const url = this._getUrl(nakedPath);
      request(url, (error, response, body) => {
        let parsed;

        if (error || response.statusCode !== 200) {
          return reject(`HttpStrategy Error: ${error}`);
        }

        try {
          parsed = JSON.parse(body);
        } catch (parseError) {
          return reject(`HttpStrategy Error: ${parseError}`);
        }

        resolve(parsed.data.html);
      });
    });
  }

  _getUrl(nakedPath) {
    return `${this.baseUrl}${nakedPath}.json`;
  }

  _stripBaseUrl(baseUrl) {
    return stripOuter(baseUrl, '/');
  }
}
