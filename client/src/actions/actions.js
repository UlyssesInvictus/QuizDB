import * as qs from 'qs';
import Notifications from 'react-notification-system-redux';


// While app is simple, keep everything in one action module :)

/*
 * action types
 */

export const GET_FILTER_OPTIONS = 'GET_FILTER_OPTIONS';
export const RECEIVE_FILTER_OPTIONS = 'RECEIVE_FILTER_OPTIONS';

export const UPDATE_SEARCH = 'UPDATE_SEARCH';
export const UPDATE_SEARCH_FILTER = 'UPDATE_SEARCH_FILTER';
export const SET_SEARCH_FILTERS = 'SET_SEARCH_FILTERS';

export const SEARCH_QUESTIONS = 'SEARCH_QUESTIONS';
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';

export const GET_ERROR_TYPES = 'GET_ERROR_TYPES';
export const RECEIVE_ERROR_TYPES = 'RECEIVE_ERROR_TYPES';
export const TOGGLE_ERROR_MODAL = 'TOGGLE_ERROR_MODAL';
export const SUBMIT_ERROR = 'SUBMIT_ERROR';
export const RECEIVE_ERROR_STATUS = 'RECEIVE_ERROR_STATUS';

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

/*
 * action creators
 */

export function updateSearch(query) {
  return { type: UPDATE_SEARCH, query }
}
export function updateSearchFilter(filter, values) {
  return { type: UPDATE_SEARCH_FILTER, filter, values }
}
export function setSearchFilters(filters) {
  return { type: SET_SEARCH_FILTERS, filters: filters }
}

function getFilterOptions() {
  return { type: GET_FILTER_OPTIONS };
}
function receiveFilterOptions(json) {
  return {
    type: RECEIVE_FILTER_OPTIONS,
    filter_options: json
  }
}
export function fetchFilterOptions() {
  return function (dispatch) {
    dispatch(getFilterOptions());
    return window.fetch(`api/filter_options`)
      .then(
        response => response.json(),
        error => console.log('QuizDB: an error occurred.', error)
      ).then(
        json => dispatch(receiveFilterOptions(json))
      )
      // TODO: add dedicated success/error actions and states
  }
}

function searchQuestions(stateKey=null) {
  return { type: SEARCH_QUESTIONS, stateKey: stateKey };
}
function receiveQuestions(json, lastSearchOptions, stateKey=null) {
  return {
    type: RECEIVE_QUESTIONS,
    stateKey: stateKey,
    tossups: json.data.tossups,
    num_tossups_found: json.data.num_tossups_found,
    bonuses: json.data.bonuses,
    num_bonuses_found: json.data.num_bonuses_found,
    receivedAt: Date.now(),
    lastSearchOptions: lastSearchOptions
  }
}
export function fetchQuestions({
  searchQuery="",
  searchFilters={},
  limit=true,
  random=null,
  stateKey=null
}) {
  return function (dispatch) {
    dispatch(searchQuestions(stateKey));
    let searchParamsObject = {
      search: {
        query: searchQuery,
        filters: searchFilters,
        limit: limit
      }
    }
    let searchEndpoint = 'search';
    if (Number.isInteger(random)) {
      searchParamsObject.search.random = random;
      searchEndpoint = 'random';
    }
    let searchQueryString = qs.stringify(searchParamsObject, {
      arrayFormat: 'brackets'
    });
    return window.fetch(`api/${searchEndpoint}?${searchQueryString}`)
      .then(
        response => response.json(),
        error => console.log('QuizDB: an error occurred.', error)
      ).then(
        json => dispatch(receiveQuestions(json, searchParamsObject.search, stateKey))
      )
      // TODO: add dedicated success/error actions and states
  }
}

export function toggleSidebar() {
  return { type: TOGGLE_SIDEBAR };
}


function getErrorTypes() {
  return { type: GET_ERROR_TYPES };
}
function receiveErrorTypes(json) {
  return {
    type: RECEIVE_ERROR_TYPES,
    error_types: json
  }
}
export function fetchErrorTypes() {
  return function (dispatch) {
    dispatch(getErrorTypes());
    return window.fetch(`api/error_types`)
      .then(
        response => response.json(),
        error => console.log('QuizDB: an error occurred.', error)
      ).then(
        json => dispatch(receiveErrorTypes(json))
      )
      // TODO: add dedicated success/error actions and states
  }
}

export function toggleErrorModal(questionId) {
  return { type: TOGGLE_ERROR_MODAL, questionId: questionId}
}
function submitErrorAction(errorableId) {
  return { type: SUBMIT_ERROR, errorableId: errorableId };
}
function receiveErrorStatus(errorStatus, errorableId) {
  return {
    type: RECEIVE_ERROR_STATUS,
    errorableId: errorableId,
    success: errorStatus,
  }
}
function displayErrorStatusNotification(dispatch, errorReported) {
  const opts = {
    position: 'tr',
    // autoDismiss: 0,
  };
  const failOpts = Object.assign({}, opts, {
    title: "Error Report Failed",
    message: "There was a problem reporting your error. Please try again. " +
      "If the problem persists, contact the system admins."
  })
  const successOpts = Object.assign({}, opts, {
    title: "Error Report Succeeded!",
    message: "Your report succeeded! Thanks for helping maintain QuizDB. " +
      "If you see other issues, you can make another report."
  })
  if (errorReported) {
    dispatch(Notifications.success(successOpts));
  } else {
    dispatch(Notifications.error(failOpts));
  }
}

export function submitError({
  errorableId = null,
  errorableType = null,
  errorType = null,
  description = null
}) {
  if (errorType === null || description === null || description.trim() === "") {
    throw Error("missing required error info");
  }
  return function (dispatch) {
    dispatch(submitErrorAction(errorableId));
    let errorParamsObject = {
      error: {
        errorable_id: errorableId,
        errorable_type: errorableType,
        error_type: errorType,
        description: description
      }
    };
    return window.fetch(`api/errors`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorParamsObject)
      })
      .then(response => {
        displayErrorStatusNotification(dispatch, response.ok);
        dispatch(receiveErrorStatus(response.ok, errorableId))
      })
  }
}
