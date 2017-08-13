import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  Container
} from 'semantic-ui-react';

class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {shrink: false};
    this.handleScroll = this.handleScroll.bind(this);
    this.handleBrandClick = this.handleBrandClick.bind(this);
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

  render() {
    return <nav className={'navbar ' + (this.state.shrink ? 'shrink' : '')}>
      <Container>
        <div className='navbar-brand' onClick={this.handleBrandClick}>
          <img src='/quizdb.png' alt='QuizDB - Logo'/>
          QuizDB
        </div>
      </Container>
    </nav>
  }
}
export default withRouter(Navbar);
