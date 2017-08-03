import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// redux stuff
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk'
// track responsive states
import { responsiveStoreEnhancer } from 'redux-responsive'

import quizdb from './reducers/reducers.js';

// Use semantic ui styles
import 'semantic-ui-css/semantic.css';

// Build our store, compose with enhancers and middleware, etc.
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;
let store = createStore(
  quizdb,
  composeEnhancers(
    /* Default responsive breakpoints
    const defaultBreakpoints = {
        extraSmall: 480,
        small: 768,
        medium: 992,
        large: 1200,
    } */
    responsiveStoreEnhancer,
    applyMiddleware(thunkMiddleware)
  )
);

// Build the app!
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById('root'));
registerServiceWorker();
