import React from 'react';
import { connect } from 'react-redux';

import {
  Segment,
} from 'semantic-ui-react';

import SearchSettings from "../components/settings/SearchSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";

class PageSettings extends React.Component {

  render() {
    return <div className="quizdb-settings">
      <Segment size="large">
        <h1>Settings</h1>
        <p>
          Save settings across your current device.
          These features are experimental. Use them carefully!
        </p>
      </Segment>
      <SearchSettings />
      <AppearanceSettings/>
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
