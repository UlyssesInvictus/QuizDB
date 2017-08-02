import React from 'react';
import { connect } from 'react-redux';

import {
  updateSearch,
  fetchQuestions,
} from '../actions/actions';

import { Grid, Form, Input,
  Button, Divider, Container,
} from 'semantic-ui-react';

import SearchDropDown from './SearchDropDown';

class SearchForm extends React.Component {

  constructor(props) {
    super(props);
    this.triggerSearch = this.triggerSearch.bind(this);
  }

  triggerSearch() {
    let p = this.props;
    p.dispatch(fetchQuestions(p.search.value, p.search.filters));
  }

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
            <Button attached='left' icon='search' content='Search'
                    onClick={this.triggerSearch}/>
            <Button attached='right' icon='random' content='Random' />
          </Button.Group>
        </Grid.Column>
      </Grid>

      <Divider section/>

      <Grid stackable doubling columns='equal' textAlign='center'>
        <Grid.Row>
          <SearchDropDown name='Test 1'
                          filter='questions'/>
          <SearchDropDown name='Test 2'
                          filter='questions'/>
          <SearchDropDown name='Test 3'
                          filter='questions'/>
        </Grid.Row>
        <Grid.Row>
          <SearchDropDown name='Test 4'
                          filter='questions'/>
          <SearchDropDown name='Test 5'
                          filter='questions'/>
          <SearchDropDown name='Test 6'
                          filter='questions'/>
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
