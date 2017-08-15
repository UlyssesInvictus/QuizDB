import React from 'react';
import ReactMarkdown from 'react-markdown';
import resources from '../md/resources.md';

class PageResources extends React.Component {
  render() {
    return <div className='quizdb-resources'><div className='quizdb-md'>
      <ReactMarkdown source={resources}/>
    </div></div>
  }
}
export default PageResources;
