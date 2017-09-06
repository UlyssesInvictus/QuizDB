import React from 'react';
// Components
import QuestionsContainer from '../components/QuestionsContainer';
import SearchForm from '../components/SearchForm';
import RootCredits from '../components/RootCredits';

import {
  // Divider
} from 'semantic-ui-react';

class PageStats extends React.Component {
  render() {
    return  <div className="quizdb-stats">
      <SearchForm/>
      <RootCredits/>
      <QuestionsContainer/>
    </div>

  }
}
export default PageStats;
