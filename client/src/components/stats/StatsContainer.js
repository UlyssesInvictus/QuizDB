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

  render() {
    let q = this.props.questions;
    let view;
    if (!q.hasSearchedEver) {
      view = null;
    }
    else if (q.isFetching) {
      view = this.renderFetching();
    } else {
      view = this.renderStats(q);
    }
    return <div className="stats-container">
      {view}
    </div>
  }
}

const mapStateToProps = state => {
  return {
    questions: state.questions.stats,
    browser: state.browser,
  }
}
StatsContainer = connect(
  mapStateToProps
)(StatsContainer)

export default StatsContainer;
