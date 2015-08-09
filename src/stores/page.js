import { REQUEST_PAGE } from '../constants/ActionTypes';

const initialState = {};

export default function page(state = initialState, action) {
  if (action.type === REQUEST_PAGE) (
    console.log('requested page');
  )
  
  return state;
}
