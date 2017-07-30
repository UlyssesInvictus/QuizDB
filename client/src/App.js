import React from 'react';
import './App.css';

// Pages
import Root from './routes/Root';
import PageAbout from './routes/PageAbout';
import Page404 from './routes/Page404';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'


const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Root}/>
      <Route path="/about" component={PageAbout}/>
      <Route component={Page404}/>
    </Switch>
  </Router>
)

export default App;
