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
import sanitizeHtml from 'sanitize-html';

import ErrorModal from './ErrorModal';

import { handleEmpty } from '../utilities/String';
import { cleanString } from '../utilities/Question';

class QuestionsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {showInfo: false};
    this.renderInfo = this.renderInfo.bind(this);
    this.renderInfoColumn = this.renderInfoColumn.bind(this);
    this.renderTossup = this.renderTossup.bind(this);
    this.renderBonus = this.renderBonus.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this);
    this.renderThirdPartyIcons = this.renderThirdPartyIcons.bind(this);
  }

  componentWillMount() {
    if (this.props.browser.lessThan.medium) {
      this.setState({showInfo: false});
    }
  }

  handleIconClick(prefix, query, index=null) {
    if (prefix === 'copy') {
      let hiddenId = '#question-hidden-answer-'+this.props.question.id;
      if (index !== null) {
        hiddenId += '-' + index;
      }
      let answer = document.querySelector(hiddenId);
      answer.select();
      document.execCommand('copy');
      return;
    }

    const encodedQuery = encodeURI(query);
    window.open(`${prefix}${encodedQuery}`, '_blank');
  }

  handleSearchIconClick(query, reset = true) {
    this.props.dispatch(updateSearch(query));
    if (reset) {
      // theoretically this is a race condition, but it basically never matters
      // since we manually pass in an empty filter anyway
      this.props.dispatch(setSearchFilters({}));
      this.props.dispatch(fetchQuestions({ searchQuery: query }));
    } else {
      // same
      let lastFilters = this.props.questions.lastSearchOptions.filters;
      this.props.dispatch(setSearchFilters(lastFilters));
      this.props.dispatch(fetchQuestions({
        searchQuery: query,
        searchFilters: lastFilters
      }));
    }
  }

  renderThirdPartyIcons(query, index=null) {
    const googlePrefix = 'https://google.com/search?q=';
    const wikiPrefix = 'https://en.wikipedia.org/w/index.php?search=';
    const googleImagesPrefix = 'https://google.com/search?tbm=isch&q=';
    const q = this.props.question;
    const typePlural = q.type === "tossup" ? "tossups" : "bonuses";

    return <Grid.Column largeScreen='3' computer='2' tablet='16' mobile='16'
                        verticalAlign='middle' textAlign='center'
                        className='question-icons'>
      <Icon name='google' className='icon-clickable'
            onClick={() => this.handleIconClick(googlePrefix, query)}/>
      <Icon corner name='image' className='icon-clickable'
            onClick={() => this.handleIconClick(googleImagesPrefix, query)}/>
      <Icon name='wikipedia' className='icon-clickable'
            onClick={() => this.handleIconClick(wikiPrefix, query)}/>
      <a href={`/admin/${typePlural}/${q.id}`} target="_blank" ref="nofollow">
        <Icon name='database' className='icon-clickable' link/>
      </a>
      <Icon name='clone' className='icon-clickable'
            onClick={() => this.handleIconClick("copy", query, index)}/>
      <Icon name='repeat' corner className='icon-clickable'
            data-tip data-for={`${q.id}-repeat`}
            onClick={() => this.handleSearchIconClick(query)}/>
      <Icon name='refresh' className='icon-clickable'
            data-tip data-for={`${q.id}-refresh`}
            onClick={() => this.handleSearchIconClick(query, false)}/>

      <ReactTooltip effect='solid' type='info' id={`${q.id}-repeat`}>
        Search for this answerline, with no filters
      </ReactTooltip>
      <ReactTooltip effect='solid' type='info' id={`${q.id}-refresh`}>
        Search for this answerline, with the same filters
      </ReactTooltip>

    </Grid.Column>
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
          {this.renderThirdPartyIcons(q.answer)}
        </Grid>
      </Segment>
    </div>
  }

  renderBonus(q) {
    let formattedLeadin = cleanString(q.formatted_leadin);
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
            {this.renderThirdPartyIcons(q.answers[index], index)}
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
