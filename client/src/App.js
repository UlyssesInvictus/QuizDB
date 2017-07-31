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

class PageRefresh extends React.Component {
  render() {
    return <h3>
      <p>
        A bug in how client-side rendering works means that this app won't load
        server pages--like the one you're trying to access--properly.
      </p>
      <p>
        To fix the issue and get where you want to, do a <b>hard</b> refresh.
        (Shift-click-refresh in most browsers.)
      </p>
    </h3>
  }
}

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Root}/>
      <Route path="/about" component={PageAbout}/>
      <Route path="/admin*" component={PageRefresh}/>
      <Route component={Page404}/>
    </Switch>
  </Router>
)

export default App;
