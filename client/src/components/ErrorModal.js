import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import {
  toggleErrorModal,
} from '../actions/actions';

import {
  Modal
} from 'semantic-ui-react';

// slightly a misnomer...
class ErrorModal extends React.Component {

  render() {
    const p = this.props;
    return <Modal className="error-modal"
      open={p.open}
      closeIcon='close'
      onClose={() => p.dispatch(toggleErrorModal(p.errorableId))}>
      <Modal.Header>
        Test Error Modal
      </Modal.Header>
      <Modal.Description>
        <p>Navbar goes here</p>
      </Modal.Description>
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
