import React from 'react';

import { connect } from 'react-redux';

import { Container,
  Loader,
  Header
} from 'semantic-ui-react';

import QuestionComponent from './QuestionComponent';

class QuestionsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.renderFetching = this.renderFetching.bind(this);
    this.renderQuestions = this.renderQuestions.bind(this);
    this.renderQuestionsSection = this.renderQuestionsSection.bind(this);

  }

  renderFetching() {
    return <Loader active inline='centered' size='huge'
      content='Loading Questions'/>
  }

  renderQuestionsSection(questionsObject, questionType = 'tossup') {
    let questionTypePlural = (questionType === 'tossup') ? 'tossups' : 'bonuses';
    let questions = questionsObject[questionTypePlural];
    if (questions.length > 0) {
      return <div className={`${questionType}-container`}>
        {questions.length <= 15 || questions.length === questionsObject[`num_${questionTypePlural}_found`] ?
          `${questions.length} ${questionTypePlural} found` :
          `15 ${questionTypePlural} loaded of ${questions.length} found`
          // TODO turn this into a component that has message and load more button
        }
      {questions.map((q, index) => {
        return <QuestionComponent key={q.id} index={index + 1} question={q}/>;
      })}
      </div>
    } else {
      return <Header textAlign="center"
        size='large'
        content={`No ${questionTypePlural} found. Try loosening your filters?`}/>;
    }
  }

  renderQuestions(questions) {
    // should never happen, but whatever
    if (typeof(questions) === undefined ||
        questions === null) {
      questions = {tossups: [], bonuses: []};
    }
    let view;
    if (questions.tossups.length === 0 && questions.bonuses.length === 0) {
      view = <Header textAlign="center"
        size='huge'
        content={`No questions found. Try loosening your filters?`}/>;
    } else {
      view = <div>
        {this.renderQuestionsSection(questions)}
        {this.renderQuestionsSection(questions, 'bonus')}
      </div>
    }

    return view;
  }

  render() {
    let q = this.props.questions;
    let view;
    if (!q.hasSearchedEver) {
      view = null;
    }
    else if (q.isFetching) {
      view = this.renderFetching();
    } else {
      view = this.renderQuestions(q);
    }
    return <div className="question-container"><Container>
      {view}
    </Container></div>
  }
}

const mapStateToProps = state => {
  return {
    questions: state.questions,
    browser: state.browser
  }
}
QuestionsContainer = connect(
  mapStateToProps
)(QuestionsContainer)

export default QuestionsContainer;
