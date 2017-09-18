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

  constructor(props) {
    super(props);
    this.renderCheckbox = this.renderCheckbox.bind(this);
  }

  renderCheckbox(label, key) {
    const dispatch = this.props.dispatch;
    const settings = this.props.storage;
    return (
      <Checkbox
        label={label}
        checked={!!settings[key]}
        onChange={(_, value) => {
          dispatch(setStorage(key, value.checked))
        }}
      />
    )
  }

  render() {
    console.log(this.props.storage.randomkey);
    return <div className="quizdb-settings-storage">
      <Segment size="large">
        <Label attached='top'><h3>Appearance</h3></Label>
        <Grid columns={3} stackable>
          <Grid.Column>
            {this.renderCheckbox("Highlight matching results in search", "highlightSearch")}
          </Grid.Column>
          <Grid.Column>
            {this.renderCheckbox("Show daily QuizDB usage tips", "usageTips")}
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
