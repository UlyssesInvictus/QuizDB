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

export function Bonus({ question }) {
  let formattedLeadin = cleanString(question.formatted_leadin);
  formattedLeadin = <span dangerouslySetInnerHTML={{__html: formattedLeadin}}/>;

  const formattedTexts = question.formatted_texts.map(t => {
    let text = cleanString(t);
    return <span dangerouslySetInnerHTML={{__html: text}}/>;
  })
  const formattedAnswers = question.formatted_answers.map(a => {
    let answer = cleanString(a);
    return <span dangerouslySetInnerHTML={{__html: answer}}/>;
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
};

export default Bonus;
