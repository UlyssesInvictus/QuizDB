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
          {" Sponsored by "}
          <a href="http://www.pace-nsc.org/" target="_blank" rel="noopener noreferrer">PACE</a>
        </p>
      </Header>
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick"/>
        <input type="hidden" name="hosted_button_id" value="TEEB54JVFRKRL"/>
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
               name="submit" alt="PayPal - The safer, easier way to pay online!"/>
        <img alt="" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"/>
      </form>

    </Container></div>

  }
}
export default Root;
