import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import {
  Button,
  Segment,
  Label,
  Grid,
  Icon
} from 'semantic-ui-react';
import ReactTooltip from 'react-tooltip';

class QuestionsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.renderInfoColumn = this.renderInfoColumn.bind(this);
    this.renderTossup = this.renderTossup.bind(this);
    this.renderBonus = this.renderBonus.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    this.renderThirdPartyIcons = this.renderThirdPartyIcons.bind(this);
  }

  handleIconClick(prefix, query) {
    const encodedQuery = encodeURI(query);
    window.open(`${prefix}${encodedQuery}`, '_blank');
  }

  renderThirdPartyIcons(query) {
    const googlePrefix = 'https://google.com/search?q=';
    const wikiPrefix = 'https://en.wikipedia.org/w/index.php?search=';
    const googleImagesPrefix = 'https://google.com/search?tbm=isch&q=';

    return <Grid.Column computer='2' tablet='2' mobile='16'
                        verticalAlign='middle' textAlign='center'>
      <Icon name='google' className='icon-clickable'
            onClick={() => this.handleIconClick(googlePrefix, query)}/>
      <Icon corner name='image' className='icon-clickable'
            onClick={() => this.handleIconClick(googleImagesPrefix, query)}/>
      <Icon name='wikipedia' className='icon-clickable'
            onClick={() => this.handleIconClick(wikiPrefix, query)}/>
    </Grid.Column>

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
          <Grid.Column computer='14' tablet='14' mobile='16' >
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
            <Grid.Column computer='14' tablet='14' mobile='16' >
              <strong>ANSWER: </strong>{q.answers[index]}
            </Grid.Column>
            {this.renderThirdPartyIcons(q.answer)}
          </Grid>
        </Segment>
      })}
    </div>
  }

  render() {
    const p = this.props;
    const q = this.props.question;
    return <div className='question'><Segment.Group>
        <Segment className="question-info">
          {p.index ? this.renderInfoColumn(q.id, "Result #", p.index) : null}
          {this.renderInfoColumn(q.id, "ID", q.id)}
          {this.renderInfoColumn(q.id, "Tournament", q.tournament.name)}
          {this.renderInfoColumn(q.id, "Round", q.round)}
          {this.renderInfoColumn(q.id, "#", q.number)}
          {this.renderInfoColumn(q.id, "Category", q.category.name)}
          {this.renderInfoColumn(q.id, "Subcategory", q.subcategory.name, "None")}
          <Button content='Submit errors [WIP]'/>
        </Segment>
        {p.questionType === "tossup" ? this.renderTossup(q) : this.renderBonus(q)}
    </Segment.Group></div>
  }
}


QuestionsComponent.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number,
  questionType: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    browser: state.browser
  }
}

QuestionsComponent = connect(
  mapStateToProps
)(QuestionsComponent)

export default QuestionsComponent;
