import React from 'react';

import { connect } from 'react-redux';

import {
  Button,
  Segment,
  Label
} from 'semantic-ui-react';

import PropTypes from 'prop-types';

class QuestionsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.renderInfoColumn = this.renderInfoColumn.bind(this);

  }

  renderInfoColumn(name, value, unknownText="Unknown") {
    return <Segment className="question-info-segment">
      <Label attached="top" className="question-info-label">{name}</Label>
      <div className='question-info-text'>{value && value.trim !== "" ? value : unknownText}</div>
    </Segment>
  }

  render() {
    const p = this.props;
    const q = this.props.question;
    return <div className='question'><Segment.Group>
        <Segment className="question-info">
          {p.index ? this.renderInfoColumn("Result #", p.index) : null}
          {this.renderInfoColumn("ID", q.id)}
          {this.renderInfoColumn("Tournament", q.tournament.name)}
          {this.renderInfoColumn("Round", q.round)}
          {this.renderInfoColumn("#", q.number)}
          {this.renderInfoColumn("Category", q.category.name)}
          {this.renderInfoColumn("Subcategory", q.subcategory.name, "None")}
          <Button content='Submit errors'/>
        </Segment>
        <Segment className="question-tossup-text">
          {q.text}
        </Segment>
        <Segment className="question-tossup-answer">
          <strong>ANSWER: </strong>{q.answer}
        </Segment>
    </Segment.Group></div>
  }
}


QuestionsComponent.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number
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
