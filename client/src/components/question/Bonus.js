import React from 'react';
import PropTypes from 'prop-types';

import {
  Segment,
} from 'semantic-ui-react';

import AnswerLine from './AnswerLine';

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
        <AnswerLine
          question={question}
          answer={formattedAnswers[index]}
          id={`${question.id}-${index}`}
          index={index}
        />
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
