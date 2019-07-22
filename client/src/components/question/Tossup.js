import React from 'react';
import PropTypes from 'prop-types';

import {
  Segment,
} from 'semantic-ui-react';

import AnswerLine from './AnswerLine';

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
        <AnswerLine
          question={question}
          answer={formattedAnswer}
          id={question.id}
        />
      </Segment>
    </div>
  )
}

Tossup.propTypes = {
  question: PropTypes.object.isRequired,
  query: PropTypes.string,
};

export default Tossup;
