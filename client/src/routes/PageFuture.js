import React from 'react';
import ReactMarkdown from 'react-markdown';
import future from '../md/future.md';

class PageFuture extends React.Component {
  render() {
    return <div className='quizdb-futue'><div className='quizdb-md'>
      <ReactMarkdown source={future}/>
    </div></div>
  }
}
export default PageFuture;
