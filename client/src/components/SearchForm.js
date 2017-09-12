import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  fetchFilterOptions,
  updateSearch,
  fetchQuestions,
} from '../actions/actions';

import { Grid, Input,
  Button,
  Container,
  Loader,
  Dropdown
} from 'semantic-ui-react';

import SearchDropDown from './SearchDropDown';

class SearchForm extends React.Component {

  constructor(props) {
    super(props);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.renderSearchOptions = this.renderSearchOptions.bind(this);
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

  buildTourneyOptions(difficulties, tournaments) {
    let tourneyOptions = difficulties.map(c => {
      let opts = [{
        text: `${c.title}`,
        value: c.title,
        className: 'search-dropdown-header'
      }];
      opts.push(tournaments.filter(t => {
        return t.difficulty_num === c.number;
      }).map(t => {
        return {
          text: t.name,
          value: t.id
        };
      }));
      opts = [].concat(...opts);
      // don't bother showing header if it's not a header for anything
      return opts.length > 1 ? opts : [];
    });
    // take care of unassigned tournaments
    let unknownDiffOptions = [{
      text: 'Unknown',
      value: 'unknown',
      className: 'search-dropdown-header'
    }];
    unknownDiffOptions.push(tournaments.filter(t => {
      return t.difficulty_num === null;
    }).map(t => {
      return {
        text: t.name,
        value: t.id
      };
    }));
    unknownDiffOptions = [].concat(...unknownDiffOptions);
    if (unknownDiffOptions.length > 1) {
      tourneyOptions.push(unknownDiffOptions);
    }
    tourneyOptions = [].concat(...tourneyOptions);
    return tourneyOptions;
  }

  buildSubcategoryOptions(categories, subcategories) {
    const catIds = subcategories.map(s => s.category_id);
    const cats = categories.filter(c => catIds.includes(c.id));
    return [].concat(...cats.map(c => {
      let opts = [{
        text: `${c.name}`,
        value: c.name,
        className: 'search-dropdown-header'
      }];
      opts.push(subcategories.filter(t => {
        return t.category_id === c.id;
      }).map(t => {
        return {
          text: t.name,
          value: t.id
        };
      }));
      opts = [].concat(...opts);
      // don't bother showing header if it's not a header for anything
      return opts.length > 1 ? opts : [];
    }));
  }

  renderSearchOptions() {
    const f = this.props.search.filterOptions;
    const selected = this.props.search.filters;

    let selectedDiffs = f.difficulty;
    if (selected.difficulty && selected.difficulty.length > 0) {
      selectedDiffs = selectedDiffs.filter((d) => {
        return selected.difficulty.includes(d.name);
      });
    }
    const selectedCats = (selected.category && selected.category.length > 0) ?
      f.category.filter(c => selected.category.includes(c.id)) : f.category;

    const tourneyOptions = this.buildTourneyOptions(selectedDiffs, f.tournament);
    const subcatOptions = this.buildSubcategoryOptions(selectedCats, f.subcategory);

    // actually render our filter dropdowns
    return <Grid columns='equal' textAlign='center'>
      <SearchDropDown name='Category'
                      filter='category'
                      options={f.category.map(c => ({
                        text: c.name, value: c.id
                      }))}/>
      <SearchDropDown name='Search Type'
                      filter='search_type'
                      options={f.search_type.map(c => ({
                        text: c, value: c
                      }))}/>
      <SearchDropDown name='Difficulty'
                      filter='difficulty'
                      options={f.difficulty.map(c => ({
                        text: `${c.number} (${c.title})`, value: c.name
                      }))}/>
      <SearchDropDown name='Subcategory'
                      filter='subcategory'
                      options={subcatOptions}/>
      <SearchDropDown name='Question Type'
                      filter='question_type'
                      options={f.question_type.map(c => ({
                        text: c, value: c
                      }))}/>
      <SearchDropDown name='Tournament'
                      filter='tournament'
                      options={tourneyOptions}/>

    </Grid>;
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
          />
        </Grid.Column>
        {/* Search buttons */}
        <Grid.Column width={6} floated='right'>
          <Button className='search-search_button'
                  attached='left' icon='search' content='Search'
                  onClick={this.triggerSearch}
                  onSubmit={this.triggerSearch}
                  size='huge'
          />
          <Dropdown className='search-random_button'
                    options={randomOptions}
                    text='Random'
                    selection
                    closeOnChange={false}
          />
        </Grid.Column>
      </Grid>

      {this.props.search.filterOptions ?
        this.renderSearchOptions() :
        <Loader active inline='centered' size='huge'
          content='Loading Search Options'/>
      }

    </Container></div>
  }
}

SearchForm.PropTypes = {
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
