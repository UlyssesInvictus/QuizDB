import React from 'react';
import PropTypes from 'prop-types';

import {
  Segment,
  Grid,
} from 'semantic-ui-react';
import ThirdPartyIcons from "./ThirdPartyIcons";

import {
  cleanString,
} from '../../utilities/Question';

const Tossup = ({ question }) => {
  let formattedText = cleanString(question.formatted_text);
  formattedText = <span dangerouslySetInnerHTML={{__html: formattedText}}/>;
  let formattedAnswer = cleanString(question.formatted_answer);
  formattedAnswer = <span dangerouslySetInnerHTML={{__html: formattedAnswer}}/>;

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
};

export default Tossup;
