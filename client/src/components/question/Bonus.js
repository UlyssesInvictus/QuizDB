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

export function Bonus({ question, query }) {
  const formattedLeadin = formatQuestionString(question.formatted_leadin, query);

  const formattedTexts = question.formatted_texts.map(t => {
    return formatQuestionString(t, query);
  })
  const formattedAnswers = question.formatted_answers.map(a => {
    return formatQuestionString(a, query);
  });

  const renderBonusPart = (index) => {
    return (
      <Segment className="question-bonus-part" key={`question-bonus-part-${index}`}>
        <p><strong>[10] </strong>{formattedTexts[index]}</p>
        <Grid columns='16'>
          <Grid.Column largeScreen='13' computer='14' tablet='16' mobile='16' >
            <strong>ANSWER: </strong>{formattedAnswers[index]}
            <input id={`question-hidden-answer-${question.id}-${index}`}
                   className='question-hidden-answer'
                   value={question.answers[index]} readOnly/>
          </Grid.Column>
          <ThirdPartyIcons question={question} index={index} />
        </Grid>
      </Segment>
    );
  }

  return (
    <div className="question-content">
      <Segment className="question-bonus-leadin">
        <strong>Question: </strong>{formattedLeadin}
      </Segment>
      {[0, 1, 2].map(index => renderBonusPart(index))}
    </div>
  );
}

Bonus.propTypes = {
  question: PropTypes.object.isRequired,
  query: PropTypes.string,
};

export default Bonus;
