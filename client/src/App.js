import React from 'react';
import './App.css';

// Pages
import Root from './routes/Root';
import PageAbout from './routes/PageAbout';


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
      <Route component={Root}/>
    </Switch>
  </Router>
)

export default App;
