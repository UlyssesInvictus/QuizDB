import React from 'react';
import { connect } from 'react-redux';
import { loadStorage, setStorage } from '../actions/StorageActions';

import { createStorage } from '../utilities/Storage';

import {
  Segment,
} from 'semantic-ui-react';

class PageSettings extends React.Component {

  constructor(props) {
    super(props);
    this.props.dispatch(loadStorage());
  }

  render() {

    return <div className="quizdb-settings">
      <Segment size="large">
        <h1>Settings</h1>
        <p>
          Save settings across your current device.
          These features are experimental. Use them carefully!
        </p>
      </Segment>
    </div>
  }
}

const mapStateToProps = state => {
  return {
    storage: state.storage,
  }
}
PageSettings = connect(
  mapStateToProps
)(PageSettings)

export default PageSettings;
