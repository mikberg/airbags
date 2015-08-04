import {map} from 'lodash';
import {cache, contentCache} from '../tasks/cache';

export default {
  getFrontMatter: (url) => {
    return cache[url];
  },

  getContents: (url) => {
    return contentCache[url];
  },

  getPages: () => {
    return map(cache, (p) => p);
  }
};
