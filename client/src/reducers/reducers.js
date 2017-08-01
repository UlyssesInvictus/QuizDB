// While app is simple, keep everything in one reducer module :)

import { combineReducers } from 'redux';

import {
  UPDATE_SEARCH,
} from '../actions/actions';

const initialSearchState = {
  value: ""
}

function search(state = initialSearchState, action) {
  switch(action.type) {
    case UPDATE_SEARCH:
      return Object.assign({}, state, {
        value: action.value
      });
    default:
      return state;
  }
}


const quizdb = combineReducers({
  search,
})

export default quizdb
