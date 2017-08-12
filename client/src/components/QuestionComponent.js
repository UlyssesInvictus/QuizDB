import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import {
  toggleErrorModal,
  updateSearch,
  setSearchFilters,
  fetchQuestions,
} from '../actions/actions';

import {
  Button,
  Segment,
  Label,
  Grid,
  Icon
} from 'semantic-ui-react';
import ReactTooltip from 'react-tooltip';

import ErrorModal from './ErrorModal';

class QuestionsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.renderInfo = this.renderInfo.bind(this);
    this.renderInfoColumn = this.renderInfoColumn.bind(this);
    this.renderTossup = this.renderTossup.bind(this);
    this.renderBonus = this.renderBonus.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
    this.renderThirdPartyIcons = this.renderThirdPartyIcons.bind(this);
  }

  handleIconClick(prefix, query) {
    const encodedQuery = encodeURI(query);
    window.open(`${prefix}${encodedQuery}`, '_blank');
  }

  handleSearchIconClick(query, reset = true) {
    this.props.dispatch(updateSearch(query));
    if (reset) {
      // theoretically this is a race condition, but it basically never matters
      // since we manually pass in an empty filter anyway
      this.props.dispatch(setSearchFilters({}));
      this.props.dispatch(fetchQuestions(query, {}));
    } else {
      // same
      let lastFilters = this.props.questions.lastSearchOptions.filters;
      this.props.dispatch(setSearchFilters(lastFilters));
      this.props.dispatch(fetchQuestions(query, lastFilters));
    }
  }

  renderThirdPartyIcons(query) {
    const googlePrefix = 'https://google.com/search?q=';
    const wikiPrefix = 'https://en.wikipedia.org/w/index.php?search=';
    const googleImagesPrefix = 'https://google.com/search?tbm=isch&q=';

    return <Grid.Column largeScreen='3' computer='2' tablet='16' mobile='16'
                        verticalAlign='middle' textAlign='center'>
      <Icon name='google' className='icon-clickable'
            onClick={() => this.handleIconClick(googlePrefix, query)}/>
      <Icon corner name='image' className='icon-clickable'
            onClick={() => this.handleIconClick(googleImagesPrefix, query)}/>
      <Icon name='wikipedia' className='icon-clickable'
            onClick={() => this.handleIconClick(wikiPrefix, query)}/>
      <Icon name='repeat' corner className='icon-clickable'
            data-tip data-for={`${this.props.question.id}-repeat`}
            onClick={() => this.handleSearchIconClick(query)}/>
      <Icon name='refresh' className='icon-clickable'
            data-tip data-for={`${this.props.question.id}-refresh`}
            onClick={() => this.handleSearchIconClick(query, false)}/>

      <ReactTooltip effect='solid' type='info' id={`${this.props.question.id}-repeat`}>
        Search for this answerline, with no filters
      </ReactTooltip>
      <ReactTooltip effect='solid' type='info' id={`${this.props.question.id}-refresh`}>
        Search for this answerline, with the same filters
      </ReactTooltip>

    </Grid.Column>
  }

  renderInfo() {
    const p = this.props;
    const q = p.question;

    return  <Segment className="question-info">
      {p.index ? this.renderInfoColumn(q.id, "Result #", p.index) : null}
      {this.renderInfoColumn(q.id, "ID", q.id)}
      {this.renderInfoColumn(q.id, "Tournament", q.tournament.name)}
      {this.renderInfoColumn(q.id, "Round", q.round)}
      {this.renderInfoColumn(q.id, "#", q.number)}
      {this.renderInfoColumn(q.id, "Category", q.category.name)}
      {this.renderInfoColumn(q.id, "Subcategory", q.subcategory.name, "None")}
      <Button content='Report error or fix'
              className='error-modal-trigger'
              onClick={() => p.dispatch(toggleErrorModal(q.id))}/>
    </Segment>
  }

  renderInfoColumn(questionId, name, value, unknownText="Unknown") {
    const infoText = (value && value.trim !== "" ? value : unknownText);
    return <Segment className="question-info-segment">
      <Label attached="top" className="question-info-label">{name}</Label>
      <div className='question-info-text' data-tip data-for={`${questionId}-${name}`}>
        {infoText}
      </div>
      <ReactTooltip effect='solid' type='info' id={`${questionId}-${name}`}>
        {infoText}
      </ReactTooltip>
    </Segment>
  }

  renderTossup(q) {

    return <div className="question-content">
      <Segment className="question-tossup-text">
        <strong>Question: </strong>{q.text}
      </Segment>
      <Segment className="question-tossup-answer">
        <Grid columns='16'>
          <Grid.Column largeScreen='13' computer='14' tablet='14' mobile='16' >
            <strong>ANSWER: </strong>{q.answer}
          </Grid.Column>
          {this.renderThirdPartyIcons(q.answer)}
        </Grid>
      </Segment>
    </div>
  }

  renderBonus(q) {
    return <div className="question-content">
      <Segment className="question-bonus-leadin">
        <strong>Question: </strong>{q.leadin}
      </Segment>
      {[0, 1, 2].map(index => {
        return <Segment className="question-bonus-part" key={`question-bonus-part-${index}`}>
          <p><strong>[10] </strong>{q.texts[index]}</p>
          <Grid columns='16'>
            <Grid.Column largeScreen='13' computer='14' tablet='14' mobile='16' >
              <strong>ANSWER: </strong>{q.answers[index]}
            </Grid.Column>
            {this.renderThirdPartyIcons(q.answers[index])}
          </Grid>
        </Segment>
      })}
    </div>
  }

  render() {
    const p = this.props;
    const q = this.props.question;
    return <div className='question'><Segment.Group>
        {this.renderInfo()}
        {p.questionType === "tossup" ? this.renderTossup(q) : this.renderBonus(q)}
    </Segment.Group>
    <ErrorModal
      errorableType={p.questionType}
      errorableId={q.id}
      open={!!p.errors[q.id] && !!p.errors[q.id].modalOpen}
    />
    </div>
  }
}


QuestionsComponent.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number,
  questionType: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    browser: state.browser,
    errors: state.errors,
    search: state.search,
    questions: state.questions
  }
}

QuestionsComponent = connect(
  mapStateToProps
)(QuestionsComponent)

export default QuestionsComponent;
