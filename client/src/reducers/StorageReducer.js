import {
  LOAD_STORAGE,
  SET_STORAGE,
} from "../actions/StorageActions";

const initialStorageState = {
  highlightSearch: true,
  updatedAt: null,
}

function storage(state = initialStorageState, action) {
  switch (action.type) {
    case LOAD_STORAGE:
      return Object.assign({}, state, action.storage);
    case SET_STORAGE:
      return Object.assign({}, state, {
        [action.key]: action.value,
      });
    default:
      return state;
  }
}

export default storage;
