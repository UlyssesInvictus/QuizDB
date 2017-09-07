import {
  SEARCH_STATS,
  RECEIVE_STATS
} from "../actions/StatsActions";

const initialStatsState = {
  // isFetching:,
  // tossupStats:,
  // bonusStats:,
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
        tossupStats: action.tossupStats,
        bonusStats: action.bonusStats,
        lastUpdated: action.receivedAt,
      };
      return Object.assign({}, state, newStatsState);
    default:
      return state;
  }
}

export default stats;
