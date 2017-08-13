import React from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import {
  toggleSidebar,
} from '../actions/actions';

import {
  Container,
  Icon
} from 'semantic-ui-react';

class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {shrink: false};
    this.handleScroll = this.handleScroll.bind(this);
    this.handleBrandClick = this.handleBrandClick.bind(this);
    this.handleBurgerClick = this.handleBurgerClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if (window.scrollY > 20) {
      this.setState({shrink: true});
    } else {
      this.setState({shrink: false});
    }
  }

  handleBrandClick() {
    this.props.history.push("/");
  }

  handleBurgerClick() {
    this.props.dispatch(toggleSidebar());
  }

  render() {
    return <nav className={'navbar ' + (this.state.shrink ? 'shrink' : '')}>
      <Container>
        <div className='navbar-brand' onClick={this.handleBrandClick}>
          <img src='/quizdb.png' alt='QuizDB - Logo'/>
          QuizDB
        </div>
        <div className='navbar-links'>
          <div className='navbar-link'>
            <Icon name='content' onClick={this.handleBurgerClick}/>
          </div>

        </div>
      </Container>
    </nav>
  }
}

const mapStateToProps = state => {
  return {
    appearance: state.appearance
  }
}

Navbar = connect(
  mapStateToProps
)(Navbar)

export default withRouter(Navbar);
