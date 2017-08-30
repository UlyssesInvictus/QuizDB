import React from 'react';

class PageRefresh extends React.Component {
  render() {
    return <h3>
      <p>
        A bug in how web rendering works means that sometimes this app won't load
        server pages--like the one you're trying to access--properly.
      </p>
      <p>
        To fix the issue and get where you want to, do a <b>hard</b> refresh.
        (Shift-click-refresh in most browsers.)
      </p>
    </h3>
  }
}

export default PageRefresh;
