import React from 'react';
import { connect } from 'react-redux';

import {
  fetchQuestions,
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
