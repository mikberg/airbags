import {isSiteMapOk} from '../collect';

export function applyMiddleware(state, middleware) {
  if (typeof state !== 'object') {
    throw new Error(`applyMiddleware expected 'state' to be an object, got ${state}`);
  }

  if (!Array.isArray(middleware)) {
    throw new Error(`applyMiddleware expected 'middleware' to be an array, got ${middleware}`);
  }

  if (middleware.length === 0) {
    return Object.assign({}, state);
  }

  let newState;
  middleware.forEach((fn) => {
    newState = fn(Object.assign({}, state));
  });

  return newState;
}

function contextModel(state) {
  Object.assign(this, state);

  this.getSiteMap = () => state.siteMap;
  this.getConfiguration = () => state.configuration;

  /* eslint no-use-before-define:0 */
  this.copy = () => createContext(state);
}

/**
 * Creates a context object using a site map (as per returned by `collect`) and
 * some optional configuration.
 */
export function createContext(state = { siteMap: {}, configuration: {} }, middleware = []) {
  if (!isSiteMapOk(state.siteMap)) {
    throw new Error(`createContext needs a real siteMap, given ${state.siteMap}`);
  }

  if (typeof state.configuration !== 'object') {
    state.configuration = {};
  }

  const appliedState = applyMiddleware(state, middleware);

  const context = {};
  contextModel.call(context, appliedState);

  const augmenters = middleware
    .filter((mid) => !!mid.contextAugmenter)
    .map((mid) => mid.contextAugmenter);
  augmenters.forEach((augmenter) => augmenter.call(context, appliedState));

  return context;
}

export function isContextOk(context) {
  return typeof context === 'object'
      && !!context.getSiteMap && !!context.getConfiguration;
}
