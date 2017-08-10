import React from 'react';
import './App.css';

// Pages
import Root from './routes/Root';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

class PageRefresh extends React.Component {
  render() {
    return <h3>
      <p>
        A bug in how client-side rendering works means that sometimes this app won't load
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
      <Route path="/admin*" component={PageRefresh}/>
      <Route path="/" component={Root}/>
    </Switch>
  </Router>
)

export default App;
