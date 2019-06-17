import React from 'react';
import { connect } from 'react-redux';

import {
  fetchQuestions, updateSearchFilter, updateSearch
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
  componentDidMount() {
    const p = this.props;
    const urlParams = new URLSearchParams(window.location.search);

    for(const [key, value] of urlParams.entries()) {
      if(key !== 'query') {
        if(key === "category") {
          p.dispatch(updateSearchFilter(key, value.split(',').map(e => parseInt(e, 10))))
        } else {
          p.dispatch(updateSearchFilter(key, value.split(',')))
        }
      } else {
        p.dispatch(updateSearch(value))
      }
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
