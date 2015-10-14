import {isSiteMapOk} from '../collect';

function contextModel(state) {
  this.getSiteMap = () => state.siteMap;
  this.getConfiguration = () => state.configuration;

  /* eslint no-use-before-define:0 */
  this.copy = () => createContext(state);
}

/**
 * Creates a context object using a site map (as per returned by `collect`) and
 * some optional configuration.
 */
export function createContext(state = { siteMap: {}, configuration: {} }) {
  if (!isSiteMapOk(state.siteMap)) {
    throw new Error(`createContext needs a real siteMap, given ${state.siteMap}`);
  }

  if (typeof state.configuration !== 'object') {
    state.configuration = {};
  }

  const context = {};
  contextModel.call(context, state);
  return context;
}

export function isContextOk(context) {
  return typeof context === 'object'
      && !!context.getSiteMap && !!context.getConfiguration;
}
