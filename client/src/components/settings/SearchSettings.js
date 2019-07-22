import React from 'react';
import { connect } from 'react-redux';
import { setStorage } from '../../actions/StorageActions';

import {
  Segment,
  Label,
  Grid,
  Checkbox
} from 'semantic-ui-react';

class SearchSettings extends React.Component {

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
    return <div className="quizdb-settings--section">
      <Segment size="large">
        <Label attached='top'><h3>Appearance</h3></Label>
        <Grid columns={3} stackable>
          <Grid.Column>
            {this.renderCheckbox("Auto-hide answers during search", "hideSearchAnswers")}
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
SearchSettings = connect(
  mapStateToProps
)(SearchSettings)

export default SearchSettings;
