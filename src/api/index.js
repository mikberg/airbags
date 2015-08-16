import http from 'http';

class AirbagsApi {
  getPage(path) {
    return this._getJson(AirbagsApi.pathToUrl(path));
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
