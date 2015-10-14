import {isSiteMapOk} from '../collect';

function contextModel(siteMap, configuration) {
  this.getSiteMap = () => siteMap;
  this.getConfiguration = () => configuration;
}

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

  const context = {};
  contextModel.call(context, siteMap, configuration);
  return context;
}

export function isContextOk(context) {
  return typeof context === 'object'
      && !!context.getSiteMap && !!context.getConfiguration;
}
