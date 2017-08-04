import React from 'react';
// Components

import {
  Container,
  Header,
  Icon
} from 'semantic-ui-react';

class Root extends React.Component {
  render() {
    return  <div className="root-credits"><Container>
      <Header size='medium' textAlign='center' color='grey'>
        <p>
          {"Created by Raynor Kuang "}
          <Icon fitted name='question' style={{marginRight: 0}}/>
          {" Inspired by "}
          <a href="http://quinterest.org/" target="_blank" rel="noopener noreferrer">Quinterest</a>
        </p>
      </Header>
    </Container></div>

  }
}
export default Root;
