import stripOuter from 'strip-outer';
import 'isomorphic-fetch';

function getUrl(baseUrl, nakedPath) {
  return `${baseUrl}/${nakedPath}.json`;
}

const cache = {};

function httpStrategyModel(baseUrl) {
  this.getPageData = (nakedPath) => {
    const url = getUrl(baseUrl, nakedPath);

    if (cache[url]) {
      return cache[url];
    }

    cache[url] = new Promise((resolve, reject) => {
      if (typeof nakedPath !== 'string') {
        return reject(new Error(`getPageData expected a string nakedPath`));
      }

      fetch(url)
        .then((response) => {
          if (response.status !== 200) {
            return reject(new Error(`httpStrategy error: ${response.status} returned`));
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

    return cache[url];
  };

  this.getContext = () => {
    const url = `${baseUrl}/context.json`;

    if (!cache[url]) {
      cache[url] = fetch(url)
      .then((response) => {
        return response.json();
      });
    }

    return cache[url];
  };
}

export default function createHttpStrategy(baseUrl) {
  function httpStrategy() {}

  if (typeof baseUrl !== 'string') {
    throw new Error(`createHttpStrategy expected a baseUrl, got ${baseUrl}`);
  }

  httpStrategyModel.call(httpStrategy, stripOuter(baseUrl, '/'));
  return httpStrategy;
}
