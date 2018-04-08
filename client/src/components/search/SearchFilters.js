import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from 'semantic-ui-react';
import SearchDropDown from './SearchDropDown';

function buildSubcategoryOptions(categories, subcategories) {
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

function buildTourneyOptions(difficulties, tournaments) {
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

class SearchFilters extends React.Component {

  componentWillMount() {
    this.state = {
      showFilters: this.props.defaultShow,
    };

    this.buildDropDowns = this.buildDropDowns.bind(this);
  }

  buildDropDowns(){
    const {
      filterOptions,
      selectedFilters,
    } = this.props;

    let selectedDiffs = filterOptions.difficulty;
    if (selectedFilters.difficulty && selectedFilters.difficulty.length > 0) {
      selectedDiffs = selectedDiffs.filter((d) => {
        return selectedFilters.difficulty.includes(d.name);
      });
    }
    const selectedCats = (selectedFilters.category && selectedFilters.category.length > 0) ?
      filterOptions.category.filter(c => selectedFilters.category.includes(c.id)) :
      filterOptions.category;

    const tourneyOptions = buildTourneyOptions(selectedDiffs, filterOptions.tournament);
    const subcatOptions = buildSubcategoryOptions(selectedCats, filterOptions.subcategory);

    return (
      <Grid.Row>
        <SearchDropDown
          name='Category'
          filter='category'
          options={
            filterOptions.category.map(c => ({
              text: c.name, value: c.id
            }))
          }
        />
        <SearchDropDown
          name='Search Type'
          filter='search_type'
          options={
            filterOptions.search_type.map(c => ({
              text: c, value: c
            }))
          }
        />
        <SearchDropDown
          name='Difficulty'
          filter='difficulty'
          options={
            filterOptions.difficulty.map(c => ({
              text: `${c.number} (${c.title})`, value: c.name
            }))
          }
        />
        <SearchDropDown
          name='Subcategory'
          filter='subcategory'
          options={subcatOptions}
        />
        <SearchDropDown
          name='Question Type'
          filter='question_type'
          options={
            filterOptions.question_type.map(c => ({
              text: c, value: c
            }))
          }
        />
        <SearchDropDown
          name='Tournament'
          filter='tournament'
          options={tourneyOptions}
        />
      </Grid.Row>
    );
  }

  render() {
    return (
      <div className="SearchFilters">
        <Grid columns='equal' textAlign='center'>
          {this.buildDropDowns()}
        </Grid>
      </div>
    );
  }
}

SearchFilters.propTypes = {
  filterOptions: PropTypes.shape({
    category: PropTypes.array.isRequired,
    search_type: PropTypes.array.isRequired,
    difficulty: PropTypes.array.isRequired,
    subcategory: PropTypes.array.isRequired,
    tournament: PropTypes.array.isRequired,
  }).isRequired,
  selectedFilters: PropTypes.object,
  defaultShow: PropTypes.bool,
};

SearchFilters.defaultProps = {
  defaultShow: true,
};

export default SearchFilters;
