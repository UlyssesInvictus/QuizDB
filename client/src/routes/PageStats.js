import React from 'react';
// Components
import SearchForm from '../components/SearchForm';
import RootCredits from '../components/RootCredits';

import {
  // Divider
} from 'semantic-ui-react';

class PageStats extends React.Component {
  render() {
    return  <div className="quizdb-stats">
      <SearchForm stateKey="stats"/>
      <RootCredits/>
    </div>

  }
}
export default PageStats;
