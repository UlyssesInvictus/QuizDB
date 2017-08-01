import React from 'react';
import {Grid, Dropdown, Label, Segment} from 'semantic-ui-react';

import PropTypes from 'prop-types';

class SearchDropDown extends React.Component {

  render() {
    const testOptions = [
      {text: 'One', value: 'One'},
      {text: 'Two', value: 'Two'},
      {text: 'Three', value: 'Three'},
      {text: 'Four', value: 'Four'},
      {text: 'Five', value: 'Five'},
    ]

    return <Grid.Column>
      <Segment>
        <Label attached='top'>{this.props.name}</Label>
        <Dropdown placeholder='Subject'
          multiple search fluid
          selection options={testOptions}/>
      </Segment>
    </Grid.Column>
  }
}

SearchDropDown.propTypes = {
  name: PropTypes.string.isRequired,
}
export default SearchDropDown;
