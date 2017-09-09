import React from 'react';
import PropTypes from 'prop-types';

// import ReactTooltip from 'react-tooltip';

class StatsText extends React.Component {

  // constructor(props) {
  //   super(props);
  // }

  renderTooMany() {
    return <span>Too many questions to load. Please narrow your filters and search again.</span>
  }

  renderStatsText(){
    return (
      <div>
        test
      </div>
    );
  }

  render() {
    return <div className="stats-text">
      {null}
    </div>
  }
}

StatsText.PropTypes = {
  tossups: PropTypes.object.isRequired,
  bonuses: PropTypes.object.isRequired,
}

export default StatsText;
