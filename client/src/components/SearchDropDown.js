import React from 'react';
import { connect } from 'react-redux';

import {
  updateSearchFilter,
} from '../actions/actions';

import {
  Grid,
  Dropdown,
  Label,
  Segment
} from 'semantic-ui-react';

import PropTypes from 'prop-types';

class SearchDropDown extends React.Component {

  constructor(props) {
    super(props);

    this.handleFilterSearch = this.handleFilterSearch.bind(this);
  }

  handleFilterSearch(opts, query) {
    let regex = new RegExp(query, 'i');

    return opts.filter((opt) => {
      let matchesText = regex.test(opt.text);
      let matchesDiff = regex.test(opt.difficulty);
      return !opt.difficultyHeader && (matchesText || matchesDiff);
    })
  }

  render() {
    const p = this.props;

    let options = p.options;
    // TODO: map so that stuff like difficulty header doesn't show up here
    if (p.filter === 'tournament') {
      options.push({text: 'test', value: '', disabled: true, className: 'test'});
    }

    let dropdown =  <Dropdown placeholder='All'
                              multiple fluid
                              value={p.search.filters[p.filter] || []}
                              onChange={(e, data) =>
                                p.dispatch(
                                  updateSearchFilter(p.filter, data.value))}
                              selection
                              options={options}
                              search={this.handleFilterSearch}
                    />;
    return <Grid.Column mobile={8} tablet={5} computer={5}
            className='search-dropdown-column'
           >
      <Segment className='search-dropdown'>
        <Label attached='top'>
          {p.name}
        </Label>
        {dropdown}
      </Segment>
    </Grid.Column>
  }
}

SearchDropDown.propTypes = {
  name: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  return {
    search: state.search
  }
}
SearchDropDown = connect(
  mapStateToProps
)(SearchDropDown)

export default SearchDropDown;
