import React from 'react';
// Components
import QuestionsContainer from '../components/QuestionsContainer';
import SearchForm from '../components/SearchForm';
import RootCredits from '../components/RootCredits';

import {
  // Divider
} from 'semantic-ui-react';

class PageSearch extends React.Component {
  render() {
    return  <div className="quizdb-search">
      <SearchForm/>
      <RootCredits/>
      <QuestionsContainer/>
    </div>

  }
}
export default PageSearch;
