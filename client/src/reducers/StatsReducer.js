import {
  SEARCH_STATS,
  RECEIVE_STATS
} from "../actions/StatsActions";

const initialStatsState = {
  hasSearchedEver: false,
  // isFetching:,
  // tossupStats:,
  // lastUpdated:,
}

function stats(state = initialStatsState, action) {
  switch (action.type) {
    case SEARCH_STATS:
      const newSearchingState = {
        isFetching: true,
        hasSearchedEver: true,
      };
      return Object.assign({}, state, newSearchingState);
    case RECEIVE_STATS:
      const newStatsState = {
        isFetching: false,
        tossups: action.data.tossups,
        bonuses: action.data.bonuses,
        years: action.data.years,
        lastUpdated: action.receivedAt,
      };
      return Object.assign({}, state, newStatsState);
    default:
      return state;
  }
}

export default stats;
