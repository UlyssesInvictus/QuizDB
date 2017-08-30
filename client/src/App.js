import React from 'react';
import './App.css';

// Pages
import Root from './routes/Root';
import PageRefresh from './routes/PageRefresh';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

const App = () => (
  <Router>
    <Switch>
      <Route path="/admin*" component={PageRefresh}/>
      <Route path="/api*" component={PageRefresh}/>
      <Route path="/" component={Root}/>
    </Switch>
  </Router>
)

export default App;
