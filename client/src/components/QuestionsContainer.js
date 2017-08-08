import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import {
  fetchQuestions,
} from '../actions/actions';

import { Container,
  Loader,
  Header,
  Segment,
  Menu,
  Grid,
  Button
} from 'semantic-ui-react';

import QuestionComponent from './QuestionComponent';

class QuestionsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.renderFetching = this.renderFetching.bind(this);
    this.renderQuestions = this.renderQuestions.bind(this);
    this.renderQuestionsSection = this.renderQuestionsSection.bind(this);
    this.renderQuestionsSectionHeader = this.renderQuestionsSectionHeader.bind(this);
    this.loadAllQuestions = this.loadAllQuestions.bind(this);
    this.stuff = this.stuff.bind(this);
  }

  renderFetching() {
    return <Loader active inline='centered' size='huge'
      content='Loading Questions'/>
  }

  stuff() {
    console.log('test');
  }

  loadAllQuestions() {
    const p = this.props;
    p.dispatch(fetchQuestions(p.search.query, p.search.filters, false))
  }

  renderQuestionsSectionHeader(questionsObject, questionType) {
    const questionTypePlural = (questionType === 'tossup') ? 'tossups' : 'bonuses';
    const questions = questionsObject[questionTypePlural];
    const numQuestionsFound = questionsObject[`num_${questionTypePlural}_found`];

    let questionExportSection = <Menu attached='bottom' widths={4}>
      <Menu.Item header>Export as...</Menu.Item>
      <Menu.Item content="Text File [WIP]" onClick={this.stuff}/>
      <Menu.Item content="JSON [WIP]" onClick={this.stuff}/>
      <Menu.Item content="CSV [WIP]" onClick={this.stuff}/>
    </Menu>;

    let numQuestionsSection;
    if (questions.length === numQuestionsFound) {
      numQuestionsSection = <div>
        <Header textAlign='center' attached='top' size='huge'>
            {`${questions.length} ${questionTypePlural} found`}
        </Header>
        {questionExportSection}
      </div>
    } else {
      numQuestionsSection = <div>
        <Segment attached='top'><Grid columns={2} verticalAlign="middle">
          <Grid.Column computer={14} tablet={12} mobile={10}><Header textAlign='center'>
            {`${questions.length} ${questionTypePlural} loaded of ${numQuestionsFound} found`}
          </Header></Grid.Column>
          <Grid.Column computer={2} tablet={4} mobile={6} textAlign='center'>
            <Button onClick={this.loadAllQuestions}>Load All</Button>
          </Grid.Column>
        </Grid></Segment>
        {questionExportSection}
      </div>
    }


    return <div className={`${questionType}-section-header`}>
      {numQuestionsSection}
    </div>
  }

  renderQuestionsSection(questionsObject, questionType = 'tossup') {
    let questionTypePlural = (questionType === 'tossup') ? 'tossups' : 'bonuses';
    let questions = questionsObject[questionTypePlural];
    if (questions.length > 0) {
      return <div className={`${questionType}-section`}>
        {this.renderQuestionsSectionHeader(questionsObject, questionType)}
        {questions.map((q, index) => {
          return <QuestionComponent key={`${questionType}-${q.id}`}
            index={index + 1}
            question={q}
            questionType={questionType}/>;
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
      // Don't show the "No {questions} found" if they didn't search for that type
      const questionType = this.props.questions.lastSearchOptions.filters.question_type;
      const qTypeEmpty = !questionType || questionType.length === 0;
      let searchedForTossups = qTypeEmpty || questionType.includes("Tossup");
      let searchedForBonuses = qTypeEmpty || questionType.includes("Bonus");
      view = <div>
        {searchedForTossups ? this.renderQuestionsSection(questions) : null}
        {searchedForBonuses ? this.renderQuestionsSection(questions, 'bonus') : null}
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

QuestionsContainer.propTypes = {
  lastSearch: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    questions: state.questions,
    browser: state.browser,
    search: state.search
  }
}
QuestionsContainer = connect(
  mapStateToProps
)(QuestionsContainer)

export default QuestionsContainer;
