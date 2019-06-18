import React from 'react';
import { connect } from 'react-redux';

import {
  fetchQuestions, updateSearchFilter, updateSearch, fetchFilterOptions
} from '../actions/actions';

// Components
import QuestionsContainer from '../components/QuestionsContainer';
import SearchForm from '../components/SearchForm';
import RootCredits from '../components/RootCredits';

import {
  // Divider
} from 'semantic-ui-react';

import SearchEasterEggs from '../utilities/SearchEasterEggs';


class PageSearch extends React.Component {
  async componentDidMount() {
    const p = this.props;

    if(window.location.search.length !== 0) {
      const urlParams = new URLSearchParams(window.location.search);

      if (!p.search.filterOptions) {
        await p.dispatch(fetchFilterOptions())
      }

      for(const [key, value] of urlParams.entries()) {
        if(key !== 'query') {
          if(key === "category" || key === "subcategory" || key === "tournament") {
            p.dispatch(updateSearchFilter(key, value.split(',').map(e => parseInt(e, 10))))
          } else {
            p.dispatch(updateSearchFilter(key, value.split(',')))
          }
        } else {
          p.dispatch(updateSearch(value))
        }
      }

      SearchEasterEggs(this.props.dispatch, this.props.search.query);
      p.dispatch(fetchQuestions({
        searchQuery: this.props.search.query,
        searchFilters: this.props.search.filters
      }));
    }
  }

  render() {
    const p = this.props;
    return  <div className="quizdb-search">
      <SearchForm
        onSearch={() => {
          SearchEasterEggs(this.props.dispatch, p.search.query);
          p.dispatch(fetchQuestions({
            searchQuery: p.search.query,
            searchFilters: p.search.filters
          }));
        }}
      />
      <RootCredits/>
      <QuestionsContainer/>
    </div>

  }
}

const mapStateToProps = state => {
  return {
    search: state.search,
  }
}
PageSearch = connect(
  mapStateToProps
)(PageSearch)

export default PageSearch;
