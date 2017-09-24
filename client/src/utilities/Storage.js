import engine from "store/src/store-engine";

const storages = [
	require('store/storages/localStorage'),
	require('store/storages/sessionStorage'),
	require('store/storages/cookieStorage'),
	require('store/storages/memoryStorage'),
];

const plugins = [
	require('store/plugins/dump'),
];

export function createStorage() {
  return engine.createStore(storages, plugins);
}
