import React from 'react';
import ReactMarkdown from 'react-markdown';
import about from '../md/about.md';

class PageAbout extends React.Component {
  render() {
    return <div className='quizdb-about'>
      <ReactMarkdown source={about}/>
    </div>
  }
}
export default PageAbout;
