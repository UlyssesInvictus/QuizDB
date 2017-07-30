import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Use semantic ui styles
import 'semantic-ui-css/semantic.css'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
