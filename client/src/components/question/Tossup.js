import React from 'react';
import PropTypes from 'prop-types';

import {
  Segment,
  Grid,
} from 'semantic-ui-react';
import ThirdPartyIcons from "./ThirdPartyIcons";

import {
  formatQuestionString,
} from '../../utilities/Question';

const Tossup = ({ question, query }) => {
  const formattedText = formatQuestionString(question.formatted_text, query);
  const formattedAnswer = formatQuestionString(question.formatted_answer, query);

  return (
    <div className="question-content">
      <Segment className="question-tossup-text">
        <strong>Question: </strong>{formattedText}
      </Segment>
      <Segment className="question-tossup-answer">
        <Grid columns='16'>
          <Grid.Column largeScreen='13' computer='14' tablet='16' mobile='16'>
            <strong>ANSWER: </strong>{formattedAnswer}
            <input id={'question-hidden-answer-'+question.id}
                   className='question-hidden-answer'
                   value={question.answer} readOnly/>
          </Grid.Column>
          <ThirdPartyIcons question={question} />
        </Grid>
      </Segment>
    </div>
  )
}

Tossup.propTypes = {
  question: PropTypes.object.isRequired,
  query: PropTypes.string,
};

export default Tossup;
