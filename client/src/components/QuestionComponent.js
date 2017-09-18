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
import Notifications from 'react-notification-system-redux';

import ErrorModal from './ErrorModal';

import { isPresent, handleEmpty } from '../utilities/String';
import {
  cleanString,
  extractActualAnswer,
  generateWikiLink,
} from '../utilities/Question';
import sanitizeHtml from 'sanitize-html';

class QuestionsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {showInfo: false};
    this.renderInfo = this.renderInfo.bind(this);
    this.renderInfoColumn = this.renderInfoColumn.bind(this);
    this.renderBonus = this.renderBonus.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
    this.handleWikiIconClick = this.handleWikiIconClick.bind(this);
  }

  componentWillMount() {
    if (this.props.browser.lessThan.medium) {
      this.setState({showInfo: false});
    }
  }

  renderInfo() {
    const p = this.props;
    const q = p.question;

    let infoDivTall;
    let infoDivSkinny;
    if (this.state.showInfo) {
      infoDivTall = <div className="question-info-show">
        {this.renderInfoColumn(q.id, "ID", q.id)}
        {this.renderInfoColumn(q.id, "Tournament", q.tournament.name)}
        {this.renderInfoColumn(q.id, "Round", q.round)}
        {this.renderInfoColumn(q.id, "#", q.number)}
        {this.renderInfoColumn(q.id, "Category", q.category.name)}
        {this.renderInfoColumn(q.id, "Subcategory", q.subcategory.name, "None")}
      </div>;
    } else {
      let infoString = `${handleEmpty(q.tournament.name)} |
                        ${handleEmpty(q.category.name)} |
                        ${handleEmpty(q.subcategory.name)}`;
      infoDivSkinny = (
        <span className="question-info-hide"
          onClick={() => this.setState({showInfo: !this.state.showInfo})}>
          {infoString}
        </span>
      );
    }

    let showInfo = !!this.state.showInfo;
    return <Segment className="question-info">
      <div className="question-info-skinny">
        <span>
          {p.index ? <strong>{p.index}.</strong> : null }
          <Icon name={'caret ' + (showInfo ? 'up' : 'down')} size='big'
                className='question-info-toggle'
                onClick={() => this.setState({showInfo: !this.state.showInfo})}
          />
        </span>
        {infoDivSkinny}
        <Button content='Errors in question?'
                className='error-modal-trigger short'
                onClick={() => p.dispatch(toggleErrorModal(q.id))}/>
      </div>
      {infoDivTall}
    </Segment>;

  }

  renderInfoColumn(questionId, name, value, unknownText="Unknown") {
    const infoText = (value && value.trim !== "" ? value : unknownText);
    return <Segment compact className="question-info-segment">
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
    let formattedText = cleanString(q.formatted_text);
    formattedText = <span dangerouslySetInnerHTML={{__html: formattedText}}/>;
    let formattedAnswer = cleanString(q.formatted_answer);
    formattedAnswer = <span dangerouslySetInnerHTML={{__html: formattedAnswer}}/>;

    return <div className="question-content">
      <Segment className="question-tossup-text">
        <strong>Question: </strong>{formattedText}
      </Segment>
      <Segment className="question-tossup-answer">
        <Grid columns='16'>
          <Grid.Column largeScreen='13' computer='14' tablet='16' mobile='16'>
            <strong>ANSWER: </strong>{formattedAnswer}
            <input id={'question-hidden-answer-'+q.id}
                   className='question-hidden-answer'
                   value={q.answer} readOnly/>
          </Grid.Column>
          {this.renderThirdPartyIcons(isPresent(q.formatted_answer) ? q.formatted_answer : q.answer)}
        </Grid>
      </Segment>
    </div>
  }

  renderBonus(q) {
    let formattedLeadin = cleanString(q.formatted_leadin);
    formattedLeadin = <span dangerouslySetInnerHTML={{__html: formattedLeadin}}/>;
    return <div className="question-content">
      <Segment className="question-bonus-leadin">
        <strong>Question: </strong>{formattedLeadin}
      </Segment>
      {[0, 1, 2].map(index => {
        let formattedText = cleanString(q.formatted_texts[index]);
        formattedText = <span dangerouslySetInnerHTML={{__html: formattedText}}/>;
        let formattedAnswer = cleanString(q.formatted_answers[index]);
        formattedAnswer = <span dangerouslySetInnerHTML={{__html: formattedAnswer}}/>;

        return <Segment className="question-bonus-part" key={`question-bonus-part-${index}`}>
          <p><strong>[10] </strong>{formattedText}</p>
          <Grid columns='16'>
            <Grid.Column largeScreen='13' computer='14' tablet='16' mobile='16' >
              <strong>ANSWER: </strong>{formattedAnswer}
              <input id={'question-hidden-answer-'+q.id+'-'+index}
                     className='question-hidden-answer'
                     value={q.answers[index]} readOnly/>
            </Grid.Column>
            {this.renderThirdPartyIcons((isPresent(q.formatted_answers[index]) ?
                                                  q.formatted_answers[index] :
                                                  q.answers[index]),
                                        index)}
          </Grid>
        </Segment>
      })}
    </div>
  }

  render() {
    const p = this.props;
    const q = this.props.question;
    return (
      <div className='question'>
        <Segment.Group>
          {this.renderInfo()}
          {p.questionType === "tossup" ? this.renderTossup(q) : this.renderBonus(q)}
        </Segment.Group>
        <ErrorModal
          errorableType={p.questionType}
          errorableId={q.id}
          open={!!p.errors[q.id] && !!p.errors[q.id].modalOpen}
        />
      </div>
    );
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
