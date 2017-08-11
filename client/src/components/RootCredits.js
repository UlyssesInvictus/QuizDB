import React from 'react';
// Components

import {
  Container,
  Header,
  // Icon
} from 'semantic-ui-react';

class Root extends React.Component {
  render() {
    let raynorForumLink = "http://hsquizbowl.org/forums/memberlist.php?mode=viewprofile&u=5867";
    return  <div className="root-credits"><Container>
      <Header size='medium' textAlign='center' color='grey'>
        <p>
          Created by <a href={raynorForumLink} target="_blank" rel="noopener noreferrer">Raynor Kuang</a> {"<>"}
          {/* <Icon fitted name='question' style={{marginRight: 0}}/> */}
          {" Inspired by "}
          <a href="http://quinterest.org/" target="_blank" rel="noopener noreferrer">Quinterest</a>
        </p>
      </Header>
    </Container></div>

  }
}
export default Root;
