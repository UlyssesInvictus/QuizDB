import * as qs from 'qs';

// While app is simple, keep everything in one action module :)

/*
 * action types
 */

export const UPDATE_SEARCH = 'UPDATE_SEARCH';
export const UPDATE_SEARCH_FILTER = 'UPDATE_SEARCH_FILTER';

export const SEARCH_QUESTIONS = 'SEARCH_QUESTIONS';
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';

/*
 * action creators
 */

export function updateSearch(query) {
  return { type: UPDATE_SEARCH, query }
}
export function updateSearchFilter(filter, values) {
  return { type: UPDATE_SEARCH_FILTER, filter, values }
}

function searchQuestions() {
  return { type: SEARCH_QUESTIONS }
}
function receiveQuestions(json) {
  return {
    type: RECEIVE_QUESTIONS,
    tossups: json.data.tossups,
    num_tossups_found: json.data.num_tossups_found,
    bonuses: [],
    num_bonuses_found: json.data.num_bonuses_found,
    receivedAt: Date.now()
  }
}
export function fetchQuestions(searchQuery, searchFilters) {
  return function (dispatch) {
    dispatch(searchQuestions());
    let searchParamsObject = {
      search: {
        query: searchQuery,
        filters: searchFilters
      }
    }
    let searchQueryString = qs.stringify(searchParamsObject, {
      arrayFormat: 'brackets'
    });
    return window.fetch(`api/search?${searchQueryString}`, {
        body: searchFilters
      })
      .then(
        response => response.json(),
        error => console.log('QuizDB: an error occurred.', error)
      ).then(
        json => dispatch(receiveQuestions(json))
      )
      // TODO: add dedicated success/error actions and states
  }
}
