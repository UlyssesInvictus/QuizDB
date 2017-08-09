// While app is simple, keep everything in one reducer module :)

import { combineReducers } from 'redux';
// responsive state tracker
import { responsiveStateReducer } from 'redux-responsive';

import {
  // search actions
  GET_FILTER_OPTIONS,
  RECEIVE_FILTER_OPTIONS,
  UPDATE_SEARCH,
  UPDATE_SEARCH_FILTER,
  // questions actions
  SEARCH_QUESTIONS,
  RECEIVE_QUESTIONS,
  // error actions
  TOGGLE_ERROR_MODAL,
  SUBMIT_ERROR,
  RECEIVE_ERROR_STATUS
} from '../actions/actions';

const initialSearchState = {
  query: "",
  filters: {},
  filterOptions: false,
  isFetchingFilterOptions: false
}
function search(state = initialSearchState, action) {
  switch(action.type) {
    case UPDATE_SEARCH:
      return Object.assign({}, state, {
        query: action.query
      });
    case UPDATE_SEARCH_FILTER:
      return Object.assign({}, state, {
        filters: Object.assign({}, state.filters, {
          [action.filter]: action.values
        })
      })
    case GET_FILTER_OPTIONS:
      return Object.assign({}, state, {
        isFetchingFilterOptions: true
      });
    case RECEIVE_FILTER_OPTIONS:
      return Object.assign({}, state, {
        isFetchingFilterOptions: false,
        filterOptions: action.filter_options
      });
    default:
      return state;
  }
}

const initialQuestionsState = {
  hasSearchedEver: false,
  isFetching: false,
  tossups: [],
  bonuses: [],
  num_tossups_found: 0,
  num_bonuses_found: 0,
  lastUpdated: null,
  lastSearchOptions: {
    query: "",
    filters: {}
  }
}
function questions(state = initialQuestionsState, action) {
  switch (action.type) {
    case SEARCH_QUESTIONS:
      return Object.assign({}, state, {
        isFetching: true,
        hasSearchedEver: true,
      });
    case RECEIVE_QUESTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        tossups: action.tossups,
        bonuses: action.bonuses,
        num_tossups_found: action.num_tossups_found,
        num_bonuses_found: action.num_bonuses_found,
        lastUpdated: action.receivedAt,
        lastSearchOptions: action.lastSearchOptions
      });
    default:
      return state;
  }
}

const initialErrorsState = {
  errors: {
    // questionId: {
    //   modalOpen: true,
    //   errorStatus:
    // }
  }
}
function errors(state = initialErrorsState, action) {
  switch (action.type) {
    case TOGGLE_ERROR_MODAL:
      return Object.assign({}, state, {
        [action.questionId]: {
          modalOpen: !state[action.questionId] || !state[action.questionId].modalOpen
        }
      });
    default:
      return state;
  }
}

const quizdb = combineReducers({
  search,
  questions,
  errors,
  browser: responsiveStateReducer
})

export default quizdb
