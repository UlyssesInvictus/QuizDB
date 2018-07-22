import React from 'react';
import PropTypes from 'prop-types';

import retext from 'retext';
import keywords from 'retext-keywords';
import nlcstToString from 'nlcst-to-string';

import { extractTossupText, extractBonusText } from "../../utilities/Question";
import { stripStopWords } from "../../utilities/parser/Parser";

import {
  Table,
  Icon,
} from 'semantic-ui-react';
import ReactTooltip from 'react-tooltip';

class StatsText extends React.Component {

  // constructor(props) {
  //   super(props);
  // }

  renderTooMany() {
    return <span>Too many questions to load. Please narrow your filters and search again.</span>
  }

  renderStatsTextHeader() {
    return <h2 className="stats-text-header">
      Top Keyphrases <Icon name="warning sign" data-tip data-for={`stats-text-warning`}/>
      <ReactTooltip effect='solid' place='right' type='error' id={`stats-text-warning`}>
        This feature is experimental and improving gradually.
        Please excuse any glaring errors or nonsensible foibles!
      </ReactTooltip>
    </h2>
  }

  renderStatsText(){
    const tossupText = this.props.tossups.map(t => {
      return stripStopWords(extractTossupText(t));
    }).join(" ");
    const bonusText = this.props.bonuses.map(t => {
      return stripStopWords(extractBonusText(t));
    }).join(" ");
    let keyphrases;
    retext().use(keywords, {"maximum": 100}).process(tossupText + "\n\n" + bonusText, (err, file) => {
      keyphrases = file.data.keyphrases.map((phrase) => {
        return {
          score: phrase.score,
          value: phrase.matches[0].nodes.map(nlcstToString).join('')
        };
      });
    });
    return (
      <div className="stats-text-table">
        <Table striped compact size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width='4'>Phrase</Table.HeaderCell>
              <Table.HeaderCell width='4'>Relevancy Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {keyphrases.map((keyphrase, index) => {
              return (
                <Table.Row key={`keyphrase-${index}`}>
                  <Table.Cell>{keyphrase.value}</Table.Cell>
                  <Table.Cell>{(keyphrase.score * 100).toFixed(2)}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }

  render() {
    const p = this.props;
    let view = null;
    if (p.tossups.length < p.numTossupsFound || p.bonuses.length < p.numBonusesFound) {
      view = <div className="stats-text">{this.renderTooMany()}</div>;
    } else {
      view = (
        <div className="stats-text">
          {this.renderStatsTextHeader()}
          {this.renderStatsText()}
        </div>
      )
    }

    return view;
  }
}

StatsText.propTypes = {
  tossups: PropTypes.array.isRequired,
  bonuses: PropTypes.array.isRequired,
  numTossupsFound: PropTypes.number.isRequired,
  numBonusesFound: PropTypes.number.isRequired,
}

export default StatsText;
