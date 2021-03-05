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
		//answer is a span with innerHTML set to the value we're interested in
        let answer = document.querySelector(hiddenId).innerHTML;
        answer.select();
        document.execCommand('copy');
        this.props.dispatch(Notifications.success({
          title: "Answer copied to clipboard!",
		  //replace ' and "
		  //taken from https://stackoverflow.com/questions/2351576/replacing-quotation-marks-in-javascript
          message: `Copied "${query.replace(/'/g, "&apos;").replace(/"/g, "&quot;")}."`,
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
      query = isPresent(question.formatted_answer)
		? question.formatted_answer
		: question.answer;
    } else { //bonus
      query = isPresent(question.formatted_answers[index])
		? question.formatted_answers[index]
		: question.answers[index];
    }
    query = sanitizeHtml(query, {
      allowedTags: [],
      parser: { decodeEntities: false }
    });

    const googlePrefix = 'https://google.com/search?q=';
    const googleImagesPrefix = 'https://google.com/search?tbm=isch&q=';
    const typePlural = question.type === "tossup" ? "tossups" : "bonuses";

	//wrapper function that produces an icon with an associated ReactTooltip
	//goes without saying but don't put any spaces in your name variable
	const withTooltip = (name, onClick, tooltip) => <>
      <Icon name={name} className='icon-clickable'
            onClick={onClick}/>
      <ReactTooltip effect='solid' type='info' id={`${question.id}-${name}`}>
	    {tooltip}
      </ReactTooltip>
	</>;
	
	//too lazy to code special case for admin button - just split list into before and after admin button
	const iconsBeforeAdmin = [
	  {name: 'google', onClick: () => handleIconClick(googlePrefix, query), tooltip: 'Google this answerline'},
	  {name: 'image', onClick: () => handleIconClick(googleImagesPrefix, query), tooltip: 'Google Image search this answerline'},
	  {name: 'wikipedia', onClick: () => handleWikiIconClick(question, index), tooltip: 'Search for this answerline on Wikipedia'}
	];
	
	const iconsAfterAdmin = [
	  {name: 'clone', onClick: () => handleIconClick("copy", query), tooltip: 'Copy this answerline'},
	  {name: 'repeat', onClick: () => handleSearchIconClick(query), tooltip: 'Search for this answerline, with no filters'},
	  {name: 'refresh', onClick: () => handleSearchIconClick(query, false), tooltip: 'Search for this answerline, with the same filters'}
	];

    return (
      <Grid.Column largeScreen='3' computer='2' tablet='16' mobile='16'
        verticalAlign='middle'
        textAlign='center'
        className='question-icons'
      >
		{iconsBeforeAdmin.map((icon) => withTooltip(...icon))} //I don't know if spread works here - if not, just get all the params manually
        <a href={`/admin/${typePlural}/${question.id}`} target="_blank" ref="nofollow">
          <Icon name='database' className='icon-clickable' link
				data-tip data-for={`${question.id}-admin`}/>
		  <ReactTooltip effect='solid' type='info' id={`${question.id}-admin`}>
			
		  </ReactTooltip>
        </a>
		{iconsAfterAdmin.map((icon) => withTooltip(...icon))} //same comment as above
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
