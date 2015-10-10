import {isContextOk} from '../context';
import request from 'request';
import stripOuter from 'strip-outer';

/**
 * @NOTE: Could require URL to be set on context?
 */
export default class HttpStrategy {
  constructor(context, baseUrl) {
    if (!isContextOk(context)) {
      throw new Error(`HttpStrategy expected context, got ${context}`);
    }

    if (typeof baseUrl !== 'string') {
      throw new Error(`HttpStrategy expected a baseUrl, got ${baseUrl}`);
    }

    this.context = context;
    this.baseUrl = this._stripBaseUrl(baseUrl);
  }

  getPageHtml(nakedPath) {
    return new Promise((resolve, reject) => {
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
