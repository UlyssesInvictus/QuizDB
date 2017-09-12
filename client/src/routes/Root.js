import React from 'react';

// Store
import { connect } from 'react-redux';
import {
  toggleSidebar,
} from '../actions/actions';

// Routes
import {
  Route,
  Switch,
  Link,
} from 'react-router-dom';
import PageSearch from './PageSearch';
import PageStats from './PageStats';
import PageAbout from './PageAbout';
import PageResources from './PageResources';
import PageFuture from './PageFuture';
import Page404 from './Page404';
import PageRefresh from './PageRefresh';

import ReactGA from 'react-ga';

// Components
import Notifications from 'react-notification-system-redux';
import Navbar from '../components/Navbar';

import {
  Container,
  Sidebar,
  Icon,
  Menu
} from 'semantic-ui-react';

ReactGA.initialize('UA-105674080-1', {
  debug: process.env.NODE_ENV !== 'production',
});

class Root extends React.Component {

  constructor(props) {
    super(props);
    this.handleOutOfSidebarClick = this.handleOutOfSidebarClick.bind(this);
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
    this.hashLinkScroll = this.hashLinkScroll.bind(this);

    // Initial page load - only fired once
    this.sendPageChange(props.location.pathname, props.location.search)
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOutOfSidebarClick);
    window.addEventListener('keydown', this.handleInputKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutOfSidebarClick);
    window.removeEventListener('keydown', this.handleInputKeyPress);
  }

  componentWillReceiveProps(nextProps) {
    this.hashLinkScroll();
    // When props change, check if the URL has changed or not
    const currentLoc = this.props.location;
    const nextLoc = nextProps.location;
    if (currentLoc.pathname !== nextLoc.pathname ||
        currentLoc.search !== currentLoc.search) {
      this.sendPageChange(nextLoc.pathname, nextLoc.search)
    }
  }

  // get hash links working with react router
  // https://stackoverflow.com/a/40280486/4280391
  // we put this on the root component as a shortcut for listening to the history
  hashLinkScroll() {
    const { hash } = window.location;
    if (hash !== '') {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView();
      }, 0);
    }
  }

  sendPageChange(pathname, search='') {
    const page = pathname + search
    ReactGA.set({page});
    ReactGA.pageview(page);
  }

  handleInputKeyPress(e) {
    if (e.key === "Escape") {
      if (this.props.appearance.showSidebar) {
        this.props.dispatch(toggleSidebar());
      }
    }
  }

  handleOutOfSidebarClick(e) {
    const sidebar = document.querySelector('.quizdb-sidebar');
    if (!sidebar.contains(e.target) &&
        !e.target.classList.contains('navbar-burger') &&
        this.props.appearance.showSidebar) {
      this.props.dispatch(toggleSidebar());
    }
  }

  render() {
    const dispatch = this.props.dispatch;
    const sidebarWidth = this.props.browser.lessThan.medium ? 'thin' : 'wide';

    return <div className="quizdb">
      <Notifications
        notifications={this.props.notifications}
      />
      <Sidebar as={Menu} animation='overlay' width={sidebarWidth} direction='right'
                         className='quizdb-sidebar'
                         visible={this.props.appearance.showSidebar}
                         icon='labeled' vertical inverted
      >
        <Menu.Item name='remove' position='right'
                  onClick={() => this.props.dispatch(toggleSidebar())}>
          <Icon name='remove' className='quizdb-sidebar-close'/>
        </Menu.Item>
        <Menu.Item name='home' as={Link} to='/' onClick={() => dispatch(toggleSidebar())}>
            <span><Icon name='home' />Home</span>
        </Menu.Item>
        <Menu.Item name='admin' as={'a'} href='/admin' onClick={() => dispatch(toggleSidebar())}>
            <span><Icon name='dashboard'/>Admin</span>
        </Menu.Item>
        <Menu.Item name='stats' as={Link} to='/stats' onClick={() => dispatch(toggleSidebar())}>
            <span><Icon name='bar chart'/>Stats</span>
        </Menu.Item>
        <Menu.Item name='resources' as={Link} to='/resources' onClick={() => dispatch(toggleSidebar())}>
            <span><Icon name='bookmark'/>Resources</span>
        </Menu.Item>
        <Menu.Item name='about' as={Link} to='/about' onClick={() => dispatch(toggleSidebar())}>
            <span><Icon name='info circle'/>About</span>
        </Menu.Item>
        <Menu.Item name='help' as={Link} to='/about#contact' onClick={() => dispatch(toggleSidebar())}>
            <span><Icon name='question circle'/>Help</span>
        </Menu.Item>

      </Sidebar>
      <Navbar/>
      <Sidebar.Pusher>
        <Container>
          <main className='quizdb-page' id='quizdb-page'>
            <Switch>
              <Route exact path="/admin" component={PageRefresh}/>
              <Route exact path="/" component={PageSearch}/>
              <Route exact path="/about" component={PageAbout}/>
              <Route exact path="/resources" component={PageResources}/>
              <Route exact path="/future" component={PageFuture}/>
              <Route exact path="/stats" component={PageStats}/>
              <Route component={Page404}/>
            </Switch>
          </main>
        </Container>
      </Sidebar.Pusher>
    </div>
  }
}

const mapStateToProps = state => {
  return {
    notifications: state.notifications,
    browser: state.browser,
    appearance: state.appearance
  }
}

Root = connect(
  mapStateToProps
)(Root)


export default Root;
