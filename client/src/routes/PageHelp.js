import React from 'react';
import ReactMarkdown from 'react-markdown';
import help from '../md/help.md';

class PageHelp extends React.Component {
  render() {
    return <div className='quizdb-help'><div className='quizdb-md'>
      <ReactMarkdown source={help}/>
    </div></div>
  }
}
export default PageHelp;
