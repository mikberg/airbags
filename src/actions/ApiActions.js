import * as types from '../constants/ActionTypes';

export function requestPage(path) {
  return {
    type: types.REQUEST_PAGE,
    page: {
      contents: 'Yes, this is page',
      path: path
    }
  };
}
