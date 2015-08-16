import http from 'http';
import assign from 'lodash.assign';

const cache = {
  pages: {}
};

class AirbagsApi {
  // @TODO Try getting from cache
  getPage(path) {
    return this._getJson(AirbagsApi.pathToUrl(path)).then((page) => {
      this.addPageToCache(path, page);
      return page;
    });
  }

  isPageInCache(path) {
    return !!cache.pages[path];
  }

  addPageToCache(page) {
    cache.pages[page.path] = page;
  }

  getPageSync(path) {
    if (!this.isPageInCache(path)) {
      throw Error(`path is not in cache: ${path}`);
    }

    return cache.pages[path];
  }

  getPagesSync() {
    return cache.pages;
  }

  getCache() {
    return cache;
  }

  loadCache(c) {
    assign(cache, c);
  }

  _getJson(url) {
    return this._get(url).then((encoded) => {
      return JSON.parse(encoded);
    });
  }

  _get(url) {
    return new Promise((resolve, reject) => {
      http.get({path: url}, (res) => {
        let buf = '';

        res.on('data', (b) => {
          buf += b;
        });

        res.on('end', () => {
          resolve(buf);
        });

        res.on('error', reject);
      });
    });
  }
}

AirbagsApi.pathToUrl = (p) => (/^\//.test(p) ? p : '/' + p) + '.json';

export default new AirbagsApi();
