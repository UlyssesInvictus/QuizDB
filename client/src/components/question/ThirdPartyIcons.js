import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  updateSearch,
  setSearchFilters,
  fetchQuestions,
} from '../../actions/actions';

import {
  Grid,
  Icon
} from 'semantic-ui-react';
import ReactTooltip from 'react-tooltip';
import Notifications from 'react-notification-system-redux';

import sanitizeHtml from 'sanitize-html';
import { isPresent } from '../../utilities/String';
import {
  extractActualAnswer,
  generateWikiLink,
} from '../../utilities/Question';

class ThirdPartyIcons extends React.Component {
  render() {
    const {
      question,
      index,
      // redux stuff
      dispatch,
      questions,
    } = this.props;

    const handleIconClick = (prefix, query) => {
      if (prefix === 'copy') {
        let hiddenId = '#question-hidden-answer-' + question.id;
        if (index !== null) {
          hiddenId += '-' + index;
        }
        let answer = document.querySelector(hiddenId);
        answer.select();
        document.execCommand('copy');
        this.props.dispatch(Notifications.success({
          title: "Answer copied to clipboard!",
          message: `Copied "${query}."`,
        }));
        return;
      }

      const actualQuery = extractActualAnswer(query) || query;
      const encodedQuery = encodeURI(sanitizeHtml(actualQuery, {
        allowedTags: [],
        parser: { decodeEntities: false },
      }));
      window.open(`${prefix}${encodedQuery}`, '_blank');
    };

    const handleWikiIconClick = (question, index) => {
      window.open(generateWikiLink(question, index), '_blank');
    }

    const handleSearchIconClick = (query, reset = true) => {
      dispatch(updateSearch(query));
      if (reset) {
        // theoretically this is a race condition, but it basically never matters
        // since we manually pass in an empty filter anyway
        dispatch(setSearchFilters({}));
        dispatch(fetchQuestions({ searchQuery: query }));
      } else {
        // same
        let lastFilters = questions.lastSearchOptions.filters;
        dispatch(setSearchFilters(lastFilters));
        dispatch(fetchQuestions({
          searchQuery: query,
          searchFilters: lastFilters
        }));
      }
    }

    let query;
    if (question.type === "tossup") {
      query = isPresent(question.formatted_answer) ?
        question.formatted_answer : question.answer;
    } else {
      query = isPresent(question.formatted_answers[index]) ?
        question.formatted_answers[index] : question.answers[index];
    }
    query = sanitizeHtml(query, {
      allowedTags: [],
      parser: { decodeEntities: false }
    });

    const googlePrefix = 'https://google.com/search?q=';
    const googleImagesPrefix = 'https://google.com/search?tbm=isch&q=';
    const typePlural = question.type === "tossup" ? "tossups" : "bonuses";

    return (
      <Grid.Column largeScreen='3' computer='2' tablet='16' mobile='16'
        verticalAlign='middle'
        textAlign='center'
        className='question-icons'
      >
        <Icon name='google' className='icon-clickable'
              onClick={() => handleIconClick(googlePrefix, query)}/>
        <Icon corner name='image' className='icon-clickable'
              onClick={() => handleIconClick(googleImagesPrefix, query)}/>
        <Icon name='wikipedia w' className='icon-clickable'
              onClick={() => handleWikiIconClick(question, index)}/>
        <a href={`/admin/${typePlural}/${question.id}`} target="_blank" ref="nofollow">
          <Icon name='database' className='icon-clickable' link/>
        </a>
        <Icon name='clone' className='icon-clickable'
              onClick={() => handleIconClick("copy", query, index)}/>

        <Icon name='repeat' corner className='icon-clickable'
              data-tip data-for={`${question.id}-repeat`}
              onClick={() => handleSearchIconClick(query)}/>
        <Icon name='refresh' className='icon-clickable'
              data-tip data-for={`${question.id}-refresh`}
              onClick={() => handleSearchIconClick(query, false)}/>
        <ReactTooltip effect='solid' type='info' id={`${question.id}-repeat`}>
          Search for this answerline, with no filters
        </ReactTooltip>
        <ReactTooltip effect='solid' type='info' id={`${question.id}-refresh`}>
          Search for this answerline, with the same filters
        </ReactTooltip>
      </Grid.Column>
    );
  }
}

ThirdPartyIcons.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number,
};

ThirdPartyIcons.defaultProps = {
  index: null,
};

const mapStateToProps = state => {
  return {
    questions: state.questions
  }
}

ThirdPartyIcons = connect(
  mapStateToProps
)(ThirdPartyIcons);

export default ThirdPartyIcons;
