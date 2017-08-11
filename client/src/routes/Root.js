import React from 'react';
import { connect } from 'react-redux';

// Routes

import {
  Route,
  Switch
} from 'react-router-dom';
import PageSearch from './PageSearch';
import PageAbout from './PageAbout';
import Page404 from './Page404';

// Components
import Notifications from 'react-notification-system-redux';
import Navbar from '../components/Navbar';

import {
  Container
} from 'semantic-ui-react';

class Root extends React.Component {

  render() {
    console.log(this.props.notifications);
    return <div className="quizdb"><Container>
      <Navbar/>
      <Notifications
        notifications={this.props.notifications}
      />
      <Switch>
        <Route exact path="/" component={PageSearch}/>
        <Route exact path="/about" component={PageAbout}/>
        <Route component={Page404}/>
      </Switch>

      </Container></div>


  }
}

const mapStateToProps = state => {
  return {
    notifications: state.notifications,
    browser: state.browser
  }
}

Root = connect(
  mapStateToProps
)(Root)


export default Root;
