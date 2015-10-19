import {isContextOk} from '../context';
import stripOuter from 'strip-outer';
import 'isomorphic-fetch';

function getUrl(baseUrl, nakedPath) {
  return `${baseUrl}/${nakedPath}.json`;
}

function httpStrategyModel(baseUrl) {
  this.getPageData = (context, nakedPath) => {
    return new Promise((resolve, reject) => {
      if (!isContextOk(context)) {
        return reject(new Error(`getPageData expected a context, got ${context}`));
      }

      if (typeof nakedPath !== 'string') {
        return reject(new Error(`getPageData expected a string nakedPath`));
      }

      const url = getUrl(baseUrl, nakedPath);
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
  };

  this.getPageHtml = (context, nakedPath) => {
    return this.getPageData(context, nakedPath)
      .then(({data}) => {
        return data.html;
      });
  };
}

export default function createHttpStrategy(baseUrl) {
  if (typeof baseUrl !== 'string') {
    throw new Error(`createHttpStrategy expected a baseUrl, got ${baseUrl}`);
  }

  const strategy = {};
  httpStrategyModel.call(strategy, stripOuter(baseUrl, '/'));
  return strategy;
}
