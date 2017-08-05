import React from 'react';

import { connect } from 'react-redux';

import {
  Grid
} from 'semantic-ui-react';

import PropTypes from 'prop-types';

class QuestionsComponent extends React.Component {

  // constructor(props) {
    // super(props);
    // this.renderFetching = this.renderFetching.bind(this);
    // this.renderQuestions = this.renderQuestions.bind(this);
    // this.renderQuestionsSection = this.renderQuestionsSection.bind(this);
//
  // }

  render() {
    const q = this.props.question;
    return <div className="question">
      <Grid container>
        <Grid.Row>
          {q.tournament ? q.tournament.name : null}
        </Grid.Row>
        <Grid.Row>
          {q.text}
        </Grid.Row>
      </Grid>
    </div>
  }
}


QuestionsComponent.propTypes = {
  question: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  return {
    browser: state.browser
  }
}

QuestionsComponent = connect(
  mapStateToProps
)(QuestionsComponent)

export default QuestionsComponent;
