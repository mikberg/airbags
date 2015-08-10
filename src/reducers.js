import { SET_PAGE } from './actions';

export function page(state = {}, action) {
  switch (action.type) {
  case SET_PAGE:
    return state;
  default:
    return state;
  }
}
