import React from 'react';
import { connect } from 'react-redux';

import {
  updateSearchFilter,
} from '../actions/actions';

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
          onChange={(e, data) =>
            this.props.dispatch(
              updateSearchFilter(this.props.filter, data.value))}
          selection options={testOptions}/>
      </Segment>
    </Grid.Column>
  }
}

SearchDropDown.propTypes = {
  name: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    search: state.search
  }
}
SearchDropDown = connect(
  mapStateToProps
)(SearchDropDown)

export default SearchDropDown;
