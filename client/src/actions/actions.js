import * as qs from 'qs';

// While app is simple, keep everything in one action module :)

/*
 * action types
 */

export const GET_FILTER_OPTIONS = 'GET_FILTER_OPTIONS';
export const RECEIVE_FILTER_OPTIONS = 'RECEIVE_FILTER_OPTIONS';

export const UPDATE_SEARCH = 'UPDATE_SEARCH';
export const UPDATE_SEARCH_FILTER = 'UPDATE_SEARCH_FILTER';

export const SEARCH_QUESTIONS = 'SEARCH_QUESTIONS';
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';

export const TOGGLE_ERROR_MODAL = 'TOGGLE_ERROR_MODAL';
export const SUBMIT_ERROR = 'SUBMIT_ERROR';
export const RECEIVE_ERROR_STATUS = 'RECEIVE_ERROR_STATUS';

/*
 * action creators
 */

export function updateSearch(query) {
  return { type: UPDATE_SEARCH, query }
}
export function updateSearchFilter(filter, values) {
  return { type: UPDATE_SEARCH_FILTER, filter, values }
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

function searchQuestions() {
  return { type: SEARCH_QUESTIONS };
}
function receiveQuestions(json, lastSearchOptions) {
  return {
    type: RECEIVE_QUESTIONS,
    tossups: json.data.tossups,
    num_tossups_found: json.data.num_tossups_found,
    bonuses: json.data.bonuses,
    num_bonuses_found: json.data.num_bonuses_found,
    receivedAt: Date.now(),
    lastSearchOptions: lastSearchOptions
  }
}
export function fetchQuestions(searchQuery, searchFilters, limit=true, random=null) {
  return function (dispatch) {
    dispatch(searchQuestions());
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
    return window.fetch(`api/${searchEndpoint}?${searchQueryString}`, {
        body: searchFilters
      })
      .then(
        response => response.json(),
        error => console.log('QuizDB: an error occurred.', error)
      ).then(
        json => dispatch(receiveQuestions(json, searchParamsObject.search))
      )
      // TODO: add dedicated success/error actions and states
  }
}


export function toggleErrorModal(questionId) {
  return { type: TOGGLE_ERROR_MODAL, questionId: questionId}
}
function submitErrorAction() {
  return { type: SUBMIT_ERROR };
}
function receiveErrorStatus(errorStatus, json) {
  return {
    type: RECEIVE_ERROR_STATUS,
    success: errorStatus,
    error: json
  }
}
export function submitError({
  errorableId = null,
  errorableType = null,
  errorType = null,
  description = null
}) {
  if (errorType === null || description === null) {
    throw Error("missing required error info");
  }
  return function (dispatch) {
    dispatch(submitErrorAction());
    let errorParamsObject = {
      error: {
        errorable_id: errorableId,
        errorable_type: errorableType,
        error_type: errorType,
        description: description
      }
    }
    return window.fetch(`api/errors`, {
        method: 'POST',
        body: errorParamsObject
      })
      .then(response => dispatch(receiveErrorStatus(response.ok, response.json)))
  }
}
