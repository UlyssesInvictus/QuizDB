import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import {
  toggleErrorModal,
  fetchErrorTypes,
  submitError
} from '../actions/actions';
import Notifications from 'react-notification-system-redux';

import {
  Modal,
  Radio,
  Header,
  Grid,
  Button,
  TextArea,
  Loader
} from 'semantic-ui-react';

// slightly a misnomer...
class ErrorModal extends React.Component {

  // no need to get Redux involved for simple state management

  constructor(props) {
    super(props);

    this.state = {};
    this.handleRadioChange = (e, { value }) => this.setState({ errorType: value });
    this.handleTextChange = (e, { value }) => this.setState({ description: value });
    this.handleSubmitClick = this.handleSubmitClick.bind(this);

    this.renderRadioField = this.renderRadioField.bind(this);
    this.renderSubmitField = this.renderSubmitField.bind(this);
  }

  componentWillMount() {
    const e = this.props.errors;
    if (!e.isFetchingErrorTypes && (!e.errorTypes || e.errorTypes.length === 0)) {
      this.props.dispatch(fetchErrorTypes());
    }
  }

  handleSubmitClick() {
    // don't accidentally turn 0 for errorType into true...
    if (this.state.errorType === undefined || this.state.errorType === null) {
      this.props.dispatch(Notifications.error({
        // autoDismiss: 5, // default, change if desired
        title: "Error Type Must Be Selected",
        message: "Please select a type for the error. " +
          "If you're not sure, just pick 'Other,' but please be specific in your description."
      }));
      return;
    }

    if (!this.state.description || this.state.description.trim() === "") {
      this.props.dispatch(Notifications.error({
        // autoDismiss: 0,
        title: "Error Description Must Be Provided",
        message: "Please provide a description for the error. The more specific, the more helpful!"
      }));
      return;
    }

    const p = this.props;
    p.dispatch(submitError({
      errorableId: p.errorableId,
      errorableType: p.errorableType,
      errorType: this.state.errorType,
      description: this.state.description
    }));
  }

  renderRadioField(errorType, errorDescription) {
    return <Grid.Row key={errorType} className='error-type-choice'>
      <Radio
        label={errorDescription}
        name='error-modal-radio'
        value={errorType}
        checked={this.state.errorType === errorType}
        onChange={this.handleRadioChange}
      />
    </Grid.Row>
  }

  renderSubmitField(isSubmitting) {
    if (isSubmitting) {
      return <Loader active inline='centered' content='Submitting'/>;
    } else {
      return <Button content='Submit'
              onClick={this.handleSubmitClick}
      />;
    }
  }

  render() {
    const p = this.props;
    return <Modal className="error-modal"
      dimmer={false}
      open={p.open}
      closeIcon='close'
      onClose={() => p.dispatch(toggleErrorModal(p.errorableId))}>
      <Modal.Header>
        Error/Correction Submission for Question #{p.errorableId}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
            <Grid container>
              <Grid.Row><Header size='small'>
                Submit an error, correction, fix, or update. You
                must submit a type AND description. Please be as specific as possible so
                we can incorporate your feedback!
              </Header></Grid.Row>
              {p.errors.errorTypes.map(e =>
                this.renderRadioField(e.error_type, e.error_description)
              )}
              <Grid.Row>
                <TextArea placeholder="Describe the issue"
                          className="error-modal-description"
                          onChange={this.handleTextChange}/>
              </Grid.Row>
              <Grid.Row centered verticalAlign='middle'>
                {this.renderSubmitField(
                  !!p.errors[p.errorableId] &&
                  !!p.errors[p.errorableId].errorSubmitting
                )}
              </Grid.Row>
            </Grid>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  }
}

ErrorModal.propTypes = {
  errorableType: PropTypes.string.isRequired,
  errorableId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  submitting: PropTypes.bool
}

const mapStateToProps = state => {
  return {
    browser: state.browser,
    errors: state.errors
  }
}

ErrorModal = connect(
  mapStateToProps
)(ErrorModal)

export default ErrorModal;
