import * as qs from 'qs';

/*
 * action types
 */

export const SEARCH_STATS = 'SEARCH_STATS';
export const RECEIVE_STATS = 'RECEIVE_STATS';


function searchStats() {
  return { type: SEARCH_STATS };
}
function receiveStats(json) {
  return {
    type: RECEIVE_STATS,
    data: json.data,
    receivedAt: Date.now(),
  }
}
export function fetchStats({
  searchQuery="",
  searchFilters={},
}) {
  return function (dispatch) {
    dispatch(searchStats());
    let searchParamsObject = {
      search: {
        query: searchQuery,
        filters: searchFilters,
      }
    }
    let searchQueryString = qs.stringify(searchParamsObject, {
      arrayFormat: 'brackets'
    });
    return window.fetch(`api/stats?${searchQueryString}`)
      .then(
        response => response.json(),
        error => console.log('QuizDB: an error occurred.', error)
      ).then(
        json => dispatch(receiveStats(json))
      )
  }
}
