import {isSiteMapOk} from '../collect';

function contextModel(state) {
  Object.assign(this, state);

  this.getSiteMap = () => state.siteMap;
}

/**
 * Creates a context object using a site map (as per returned by `collect`) and
 * some optional configuration.
 */
export function createContext(state = { siteMap: {} }) {
  if (!isSiteMapOk(state.siteMap)) {
    throw new Error(`createContext needs a real siteMap, given ${state.siteMap}`);
  }

  const context = {};
  contextModel.call(context, state);

  return context;
}

export function isContextOk(context) {
  return typeof context === 'object'
      && !!context.getSiteMap;
}
