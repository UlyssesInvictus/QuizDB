import React from 'react';
import { connect } from 'react-redux';
import { setStorage } from '../../actions/StorageActions';

import {
  Segment,
  Label
} from 'semantic-ui-react';

class AppearanceSettings extends React.Component {

  render() {

    return <div className="quizdb-settings-storage">
      <Segment size="large">
        <Label attached='top'><h3>Appearance</h3></Label>
        <p>
          appearance settings go here
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
AppearanceSettings = connect(
  mapStateToProps
)(AppearanceSettings)

export default AppearanceSettings;
