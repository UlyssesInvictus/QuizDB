import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Grid,
} from 'semantic-ui-react';

import ThirdPartyIcons from "./ThirdPartyIcons";

const AnswerLine = ({ answer, id, question, index }) => {
  const hideAnswersDefault = localStorage.getItem('hideSearchAnswers');

  const [show, setShow] = useState(hideAnswersDefault === undefined ? false : hideAnswersDefault);

  if (!show) {
    return (
      <Grid columns='16' className='answer answer__hidden' onClick={() => setShow(true)}>
        <Grid.Column largeScreen='13' computer='14' tablet='16' mobile='16' className='answer--hidden'>
          (hidden)
        </Grid.Column>
      </Grid>
    );
  }

  return (
    <Grid columns='16' className='answer'>
      <Grid.Column largeScreen='13' computer='14' tablet='16' mobile='16' >
        <label className='answer--label' onClick={() => setShow(false)}>
          <strong>ANSWER: </strong>
        </label>{answer}
        <input id={`question-hidden-answer-${id}`}
               className='question-hidden-answer'
               value={answer} readOnly/>
      </Grid.Column>
      <ThirdPartyIcons question={question} index={index} />
    </Grid>
  );
};

AnswerLine.propTypes = {
  question: PropTypes.object.isRequired,
  // TODO: fix to just decipher from question
  answer: PropTypes.object.isRequired,
  id: PropTypes.any,
  index: PropTypes.number,
};

export default AnswerLine;
