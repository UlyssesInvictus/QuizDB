import React from 'react';
import { connect } from 'react-redux';

import {
  updateSearch,
} from '../actions/actions';

import { Grid, Form, Input,
  Button, Divider, Container,
} from 'semantic-ui-react';

import SearchDropDown from './SearchDropDown';

class SearchForm extends React.Component {

  render() {
    return <div className="search"><Container>
      <Grid stackable columns={2} textAlign={"center"}
            verticalAlign='middle'>
        {/* Search input */}
        <Grid.Column width={11}>
          <Form.Field>
            <Input fluid size='huge'
              placeholder={"Search for questions here!"}
              onChange={(e, data) => this.props.dispatch(updateSearch(data.value))}/>
          </Form.Field>
        </Grid.Column>
        {/* Search buttons */}
        <Grid.Column width={5}>
          <Button.Group size='huge' compact>
            <Button attached='left' icon='search' content='Search' />
            <Button attached='right' icon='random' content='Random' />
          </Button.Group>
        </Grid.Column>
      </Grid>

      <Divider section/>

      <Grid stackable doubling columns='equal' textAlign='center'>
        <Grid.Row>
          <SearchDropDown name={this.props.search.value}/>
          <SearchDropDown name='Test 2'/>
          <SearchDropDown name='Test 3'/>
        </Grid.Row>
        <Grid.Row>
          <SearchDropDown name='Test 4'/>
          <SearchDropDown name='Test 5'/>
          <SearchDropDown name='Test 6'/>
        </Grid.Row>
      </Grid>
    </Container></div>
  }
}

const mapStateToProps = state => {
  return {
    search: state.search
  }
}
SearchForm = connect(
  mapStateToProps
)(SearchForm)

export default SearchForm;
