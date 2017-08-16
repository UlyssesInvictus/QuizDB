// While app is simple, keep everything in one reducer module :)

import { combineReducers } from 'redux';
// responsive state tracker
import { responsiveStateReducer } from 'redux-responsive';
// notification system
import {reducer as notifications} from 'react-notification-system-redux';

import {
  // search actions
  GET_FILTER_OPTIONS,
  RECEIVE_FILTER_OPTIONS,
  UPDATE_SEARCH,
  UPDATE_SEARCH_FILTER,
  SET_SEARCH_FILTERS,
  // questions actions
  SEARCH_QUESTIONS,
  RECEIVE_QUESTIONS,
  // error actions
  GET_ERROR_TYPES,
  RECEIVE_ERROR_TYPES,
  TOGGLE_ERROR_MODAL,
  SUBMIT_ERROR,
  RECEIVE_ERROR_STATUS,
  // appearance actions
  TOGGLE_SIDEBAR,
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
      let newState = Object.assign({}, state, {
        filters: Object.assign({}, state.filters, {
          [action.filter]: action.values
        })
      });
      return newState;
    case SET_SEARCH_FILTERS:
      return Object.assign({}, state, {
        filters: action.filters
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

const initialAppearanceState = {
  showSidebar: false
}
function appearance(state = initialAppearanceState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return Object.assign({}, state, {
        showSidebar: !state.showSidebar,
      });
    default:
      return state;
  }
}

const initialErrorsState = {
  isFetchingErrorTypes: false,
  errorTypes: [
    // should be empty for init load to work right
    // but once loaded, looks like this
    // {
    //   errorType: 0,
    //   errorDescription: ""
    // }
  ],
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
    case GET_ERROR_TYPES:
      return Object.assign({}, state, {
        isFetchingErrorTypes: true
      });
    case RECEIVE_ERROR_TYPES:
      return Object.assign({}, state, {
        errorTypes: action.error_types,
        isFetchingErrorTypes: false
      });
    case SUBMIT_ERROR:
      return Object.assign({}, state, {
        [action.errorableId]: Object.assign({}, state[action.errorableId], {
          errorSubmitting: true
        })
      });
    case RECEIVE_ERROR_STATUS:
      return Object.assign({}, state, {
        [action.errorableId]: Object.assign({}, state[action.errorableId], {
          errorSubmitting: false,
          // basically, leave open for another submission attempt if failure
          // and close if 's all, goodman (but only if it was already open)
          modalOpen: !!state[action.errorableId].modalOpen && !action.success
        })
      });
    default:
      return state;
  }
}

const quizdb = combineReducers({
  search,
  questions,
  errors,
  appearance,
  browser: responsiveStateReducer,
  notifications,
})

export default quizdb
