import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// redux stuff
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import quizdb from './reducers/reducers.js';

// Use semantic ui styles
import 'semantic-ui-css/semantic.css';

let store = createStore(
  quizdb,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // link to browser log
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById('root'));
registerServiceWorker();
