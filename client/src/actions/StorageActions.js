import { createStorage } from "../utilities/Storage";

/*
 * action types
 */

export const SET_STORAGE = 'SET_STORAGE';
export const LOAD_STORAGE = 'LOAD_STORAGE';


export function loadStorage() {
  const storage = createStorage().dump();

  return {
    type: LOAD_STORAGE,
    storage: storage
  };
}
export function setStorage(key, value) {
  const storage = createStorage();
  storage.set(key, value);

  return {
    type: SET_STORAGE,
    key: key,
    value: value,
  };
}
