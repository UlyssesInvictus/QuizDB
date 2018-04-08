import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  fetchFilterOptions,
  updateSearch,
  fetchQuestions,
} from 'src/actions/actions';

import { Grid, Input,
  Button,
  Container,
  Loader,
  Dropdown
} from 'semantic-ui-react';

import SearchFilters from './SearchFilters';

class SearchForm extends React.Component {

  constructor(props) {
    super(props);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
    this.handleRandomDropdownChange = this.handleRandomDropdownChange.bind(this);
  }

  componentWillMount() {
    const p = this.props;
    if (!p.search.filterOptions) {
      p.dispatch(fetchFilterOptions());
    }
  }

  handleInputKeyPress(e) {
    if (e.key === "Enter") {
      this.triggerSearch();
    }
  }

  handleRandomDropdownChange(e, data) {
    const p = this.props;
    p.dispatch(fetchQuestions({
      searchQuery: p.search.query,
      searchFilters: p.search.filters,
      random: data.value,
    }));
  }

  triggerSearch() {
    const p = this.props;
    p.onSearch();
  }

  render() {
    const randomOptions = [
      {text: '5 Questions', value: 5, onClick: this.handleRandomDropdownChange},
      {text: '10 Questions', value: 10, onClick: this.handleRandomDropdownChange},
      {text: '25 Questions', value: 25, onClick: this.handleRandomDropdownChange},
      {text: '50 Questions', value: 50, onClick: this.handleRandomDropdownChange},
      {text: '100 QUESTIONS!!', value: 100, onClick: this.handleRandomDropdownChange},
    ]

    return <div className="search"><Container>
      <Grid stackable columns={2} textAlign={"center"}
            verticalAlign='middle' className="search-input">
        {/* Search input */}
        <Grid.Column width={10}>
          <Input fluid size='huge' width={9}
            value={this.props.search.query || ""}
            placeholder={"Search for questions here!"}
            onChange={(e, data) => this.props.dispatch(updateSearch(data.value))}
            onKeyPress={(e) => this.handleInputKeyPress(e)}
            action={
              <Button
                icon='search' content='Search'
                onClick={this.triggerSearch}
                onSubmit={this.triggerSearch}
                size='big'
                color='blue'
              />
            }
          />
        </Grid.Column>
        <Grid.Column width={6} floated="right">
          <Input action>
            <input type="hidden" />
            <Dropdown
              className='SearchForm--random-button'
              options={randomOptions}
              text='Random'
              selection
              closeOnChange={false}
              button
            />
            <Button content="Advanced" size='big' />
          </Input>
        </Grid.Column>
      </Grid>

      {this.props.search.filterOptions ?
        <SearchFilters
          filterOptions={this.props.search.filterOptions}
          selectedFilters={this.props.search.filters}
        /> :
        <Loader active inline='centered' size='huge'
          content='Loading Search Options'/>
      }

    </Container></div>
  }
}

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
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
