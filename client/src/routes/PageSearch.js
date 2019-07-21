import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  fetchQuestions, updateSearchFilter, updateSearch, setSearchFilters
} from '../actions/actions';

// Components
import QuestionsContainer from '../components/QuestionsContainer';
import SearchForm from '../components/SearchForm';
import RootCredits from '../components/RootCredits';

import {
  // Divider
} from 'semantic-ui-react';

import SearchEasterEggs from '../utilities/SearchEasterEggs';

import qs from 'qs';

class PageSearch extends React.Component {

  componentWillMount() {
    this.routeChangeUnlisten = this.props.history.listen((location, action) => {
      if(action === "POP")
        this.setQueryFromUrl();
    })
  }

  componentWillUnMount() {
    this.routeChangeUnlisten();
  }

  componentDidMount() {
    if (this.props.search.filterOptions)
      this.setQueryFromUrl();
  }

  search = (defaultQuery, defaultFilters) => {
    const {
      dispatch,
      search: {
        filters,
        query
      }
    } = this.props;

    // TODO: this is only needed below in setQueryFromUrl
    // redesign so that this is a single action and we don't need this jank in the first place
    const fullQuery = defaultQuery || query;
    const fullFilters = defaultFilters || filters;

    SearchEasterEggs(dispatch, query);
    dispatch(fetchQuestions({
      searchQuery: fullQuery,
      searchFilters: fullFilters
    }));
  }

  setQueryFromUrl = () => {
    const p = this.props;

    // Search filters need to be cleared before being built
    p.dispatch(setSearchFilters({}))

    // see todo above
    let filters = {};
    let search = null;

    if (this.props.location.search.length !== 0) {
      const currentUrlQuery = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
      Object.keys(currentUrlQuery).forEach(key => {
        const value = currentUrlQuery[key];
        if(key !== 'query') {
          if(key === "category" || key === "subcategory" || key === "tournament") {
            p.dispatch(updateSearchFilter(key, value.map(e => parseInt(e, 10))))
            filters[key] = value.map(e => parseInt(e, 10));
          } else {
            p.dispatch(updateSearchFilter(key, value))
            filters[key] = value;
          }
        } else {
          search = value;
          p.dispatch(updateSearch(value))
        }
      });

      this.search(search, filters);
    }
  }

  // TODO: ugh, this should not be playing with SearchForm like this, my bad
  componentDidUpdate(prevProps) {
    if(prevProps.search.isFetchingFilterOptions &&
      !this.props.search.isFetchingFilterOptions
    ) {
      this.setQueryFromUrl();
    }
  }

  render() {
    return  <div className="quizdb-search">
      <SearchForm
        onSearch={this.search}
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

export default withRouter(PageSearch);
