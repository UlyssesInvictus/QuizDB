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
      let isDiffHeader = !!opt.className && opt.className.includes('search-dropdown-header');
      let matchesText = regex.test(opt.text);
      // TODO: handle for group matching
      // let matchesDiff = regex.test(opt.difficulty);
      // return isDiffHeader && (matchesText || matchesDiff);
      return !isDiffHeader && matchesText;
    })
  }

  render() {
    const p = this.props;

    let options = p.options.map(opt => {
      let isDiffHeader = !!opt.className && opt.className.includes('search-dropdown-header');
      // TODO: merge in false for 'selected' if diff header (or just change styling)
      return {
        ...opt,
        disabled: isDiffHeader,
      };
    });

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
