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
    p.dispatch(fetchQuestions(p.search.query, p.search.filters));
  }

  render() {
    let isStacked = this.props.browser.lessThan.medium;
    let buttonGroupProps = {
      size: 'huge',
      compact: true
    };
    if (!isStacked) {
      buttonGroupProps.floated = 'right';
    }

    return <div className="search"><Container>
      <Grid stackable columns={2} textAlign={"center"}
            verticalAlign='middle'>
        {/* Search input */}
        <Grid.Column width={9}>
          <Form.Field>
            <Input fluid size='huge'
              placeholder={"Search for questions here!"}
              onChange={(e, data) => this.props.dispatch(updateSearch(data.value))}/>
          </Form.Field>
        </Grid.Column>
        {/* Search buttons */}
        <Grid.Column width={7} floated='right'>
          <Button.Group {...buttonGroupProps}>
            <Button attached='left' icon='search' content='Search'
                    onClick={this.triggerSearch}/>
            <Button attached='right' icon='random' content='Random' />
          </Button.Group>
        </Grid.Column>
      </Grid>

      <Divider section/>

      <Grid columns='equal' textAlign='center'>
        <SearchDropDown name='Category'
                        filter='category'/>
        <SearchDropDown name='Search Type'
                        filter='search_type'/>
        <SearchDropDown name='Difficulty'
                        filter='difficulty'/>
        <SearchDropDown name='Subcategory'
                        filter='subcategory'/>
        <SearchDropDown name='Question Type'
                        filter='question_type'/>
        <SearchDropDown name='Tournament'
                        filter='tournament'/>
      </Grid>
    </Container></div>
  }
}

const mapStateToProps = state => {
  return {
    search: state.search,
    browser: state.browser
  }
}
SearchForm = connect(
  mapStateToProps
)(SearchForm)

export default SearchForm;
