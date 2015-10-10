import {isSiteMapOk} from '../collect';

/**
 * Creates a context object using a site map (as per returned by `collect`) and
 * some optional configuration.
 */
export function createContext(siteMap, configuration = {}) {
  if (!isSiteMapOk(siteMap)) {
    throw new Error(`createContext needs a real siteMap, given ${siteMap}`);
  }

  if (typeof configuration !== 'object') {
    throw new Error(`createContext needs an object as configuration, given ${configuration}`);
  }

  return {
    siteMap,
    configuration,
  };
}

export function isContextOk(context) {
  return typeof context === 'object'
      && !!context.siteMap && !!context.configuration;
}
