import React from 'react';
import { connect } from 'react-redux';
import { setStorage } from '../../actions/StorageActions';

import {
  Segment,
  Label,
  Grid,
  Checkbox
} from 'semantic-ui-react';

class AppearanceSettings extends React.Component {

  render() {
    const dispatch = this.props.dispatch;
    const settings = this.props.storage;

    return <div className="quizdb-settings-storage">
      <Segment size="large">
        <Label attached='top'><h3>Appearance</h3></Label>
        <Grid columns={3} stackable>
          <Grid.Column>
            <Checkbox
              label="Highlight matching results in search"
              checked={!!settings.highlightSearch}
              onChange={(_, value) => {
                console.log(value);
                dispatch(setStorage("highlightSearch", value.checked))
              }}
            />
          </Grid.Column>
        </Grid>
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
