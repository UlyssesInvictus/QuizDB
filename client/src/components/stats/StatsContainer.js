import React from 'react';
// import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import {
  Loader,
} from 'semantic-ui-react';
// import ReactTooltip from 'react-tooltip';

class StatsContainer extends React.Component {

  // constructor(props) {
  //   super(props);
  // }

  renderFetching() {
    return <Loader active inline='centered' size='huge'
      content='Loading Stats'
      className="question-loader"/>
  }

  renderStats(){
    return (
      <div>
        test
      </div>
    );
  }

  render() {
    let stats = this.props.stats;
    let view;
    if (!stats.hasSearchedEver) {
      view = null;
    }
    else if (stats.isFetching) {
      view = this.renderFetching();
    } else {
      view = this.renderStats(stats);
    }
    return <div className="stats-container">
      {view}
    </div>
  }
}

const mapStateToProps = state => {
  return {
    stats: state.stats,
    browser: state.browser,
  }
}
StatsContainer = connect(
  mapStateToProps
)(StatsContainer)

export default StatsContainer;
