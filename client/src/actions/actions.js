// While app is simple, keep everything in one action module :)

/*
 * action types
 */

export const UPDATE_SEARCH = 'UPDATE_SEARCH';

/*
 * action creators
 */

export function updateSearch(value) {
  return { type: UPDATE_SEARCH, value }
}
