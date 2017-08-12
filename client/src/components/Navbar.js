import React from 'react';

import {
  Container
} from 'semantic-ui-react';

class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {shrink: false};
    this.handleScroll = this.handleScroll.bind(this);
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

  render() {
    return <nav className={'navbar ' + (this.state.shrink ? 'shrink' : '')}>
      <Container><img src='/quizdb.png'
           alt='QuizDB - Logo'/>
      QuizDB
      </Container>
    </nav>
  }
}
export default Navbar;
