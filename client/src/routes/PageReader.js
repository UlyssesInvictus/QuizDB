import "./PageReader.css";

import React from 'react';

import moment from "moment";
import pluralize from "pluralize";

const TIME_OF_PROMISE = "2017-09-10 18:11";
const PROMISE_LINK = "http://hsquizbowl.org/forums/viewtopic.php?f=123&t=20407&hilit=moxon#p335226";
const QUIZBUG_LINK = "http://quizbug2.herokuapp.com/";

const humanizeMomentDuration = (duration) => {
  const durationComponents = [
    { value: duration.years(), unit: 'year' },
    { value: duration.months(), unit: 'month' },
    { value: duration.days(), unit: 'day' },
    { value: duration.hours(), unit: 'hour' },
    { value: duration.minutes(), unit: 'minute' },
    { value: duration.seconds(), unit: 'second' },
  ];

  return durationComponents
    .filter(({ value }) => value !== 0)
    .map(({ unit, value }) =>
      `${value} ${pluralize(unit, value)}`
    )
    .join(', ')
};

class PageReader extends React.Component {

  timer = null;
  state = {
    seconds: 0
  };

  componentDidMount() {
    this.timer = setInterval(() => this.setState(prevState =>
      ({ seconds: prevState.seconds + 1 }),
    ));
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="PageReader">
        <h2>MOXON</h2>
        <h3>Is a revolutionary new question reader</h3>
        <div className="PageReader--time">
          <p>That Raynor <a href={PROMISE_LINK}>has been working</a> on for:</p>
          <div className="PageReader--time--counter">
            {humanizeMomentDuration(moment.duration(moment().diff(TIME_OF_PROMISE)))}
          </div>
        </div>
        <div className="PageReader--embarassed">
          ...maybe you should check out <a href={QUIZBUG_LINK}>this other cool reader</a> in the meantime
        </div>
      </div>
    );
  }
}

export default PageReader;
