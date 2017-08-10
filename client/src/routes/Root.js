import React from 'react';

// Routes

import {
  Route,
  Switch
} from 'react-router-dom';
import PageSearch from './PageSearch';
import PageAbout from './PageAbout';
import Page404 from './Page404';

// Components
import NotificationSystem from 'react-notification-system';
import Navbar from '../components/Navbar';

import {
  Container
} from 'semantic-ui-react';

class Root extends React.Component {
  render() {
    return  <div className="quizdb"><Container>
      <Navbar/>

    <Switch>
      <Route exact path="/" component={PageSearch}/>
      <Route exact path="/about" component={PageAbout}/>
      <Route component={Page404}/>
    </Switch>

  </Container></div>


  }
}
export default Root;
