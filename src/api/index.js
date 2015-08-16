import http from 'http';

const cache = {
  pages: {}
};

class AirbagsApi {
  getPage(path) {
    return this._getJson(AirbagsApi.pathToUrl(path)).then((page) => {
      cache.pages[path] = page;
      return page;
    });
  }

  isPageInCache(path) {
    return !!cache.pages[path];
  }

  getPageSync(path) {
    if (!this.isPageInCache(path)) {
      throw Error(`path is not in cache: ${path}`);
    }

    return cache.pages[path];
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
