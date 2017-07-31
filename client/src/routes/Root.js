import React from 'react';
// Components
import QuestionListView from '../components/QuestionListView';
import SearchForm from '../components/SearchForm';
import Navbar from '../components/Navbar';

class Root extends React.Component {
  render() {
    return  <div className="quizdb">
      <Navbar></Navbar>
      <SearchForm></SearchForm>
      <QuestionListView></QuestionListView>
    </div>

  }
}
export default Root;
