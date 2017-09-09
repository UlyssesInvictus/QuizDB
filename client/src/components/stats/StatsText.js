import React from 'react';
import PropTypes from 'prop-types';

import retext from 'retext';
import keywords from 'retext-keywords';
import nlcstToString from 'nlcst-to-string';

import { extractTossupText, extractBonusText } from "../../utilities/Question";
import { stripStopWords } from "../../utilities/parser/Parser";

class StatsText extends React.Component {

  // constructor(props) {
  //   super(props);
  // }

  renderTooMany() {
    return <span>Too many questions to load. Please narrow your filters and search again.</span>
  }

  renderStatsText(){
    const tossupText = this.props.tossups.map(t => {
      return stripStopWords(extractTossupText(t));
    }).join(" ");
    const bonusText = this.props.bonuses.map(t => {
      return stripStopWords(extractBonusText(t));
    }).join(" ");
    retext().use(keywords, {"maximum": 80}).process(tossupText + "\n\n" + bonusText, (err, file) => {
      console.log(tossupText + "\n\n" + bonusText);
      console.log(file.data.keywords.map((keyword) => {
        return {
          score: keyword.score,
          value: nlcstToString(keyword.matches[0].node)
        };
      }));
      console.log(file.data.keyphrases.map((phrase) => {
        return {
          score: phrase.score,
          value: phrase.matches[0].nodes.map(nlcstToString).join('')
        };
      }));
    });
    return (
      <div>
        test
      </div>
    );
  }

  render() {
    const p = this.props;
    let view = null;
    if (p.tossups.length < p.numTossupsFound || p.bonuses.length < p.numBonusesFound) {
      view = this.renderTooMany();
    } else {
      view = this.renderStatsText();
    }

    return <div className="stats-text">
      {view}
    </div>
  }
}

StatsText.PropTypes = {
  tossups: PropTypes.object.isRequired,
  bonuses: PropTypes.object.isRequired,
  numTossupsFound: PropTypes.number.isRequired,
  numBonusesFound: PropTypes.number.isRequired,
}

export default StatsText;
