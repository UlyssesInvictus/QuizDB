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

export function updateSearch(value) {
  return { type: UPDATE_SEARCH, value }
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
    questions: json.data.questions,
    receivedAt: Date.now()
  }
}
export function fetchQuestions(searchValue, searchFilters) {
  return function (dispatch) {
    dispatch(searchQuestions());
    return window.fetch(`api/search?q=${searchValue}`, {
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
