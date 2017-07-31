import React from 'react';

class Page404 extends React.Component {

  componentDidMount() {
    const adminPattern = /^\/admin/;
    if (process.env.NODE_ENV !== "development" &&
        adminPattern.test(window.location.pathname)) {
      // window.location.reload(true);
    }
  }

  render() {
    return <h2>About</h2>
  }
}
export default Page404;
