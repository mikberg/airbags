import http from 'http';

class AirbagsApi {
  getPage(path) {
    let url = /^\//.test(path) ? path : '/' + path;
    return this._getJson(url);
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

export default new AirbagsApi();
