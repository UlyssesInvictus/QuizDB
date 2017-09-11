import React from 'react';
import PropTypes from 'prop-types';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import { findByKey } from "../../utilities/Array";

class StatsBar extends React.Component {

  constructor(props) {
    super(props);
    this.renderBarChart = this.renderBarChart.bind(this);
  }

  renderBarHeader() {
    <h2>test</h2>
  }

  renderBarChart(){
    const p = this.props;
    const years = p.years.map(year => {
      const newYear = { year: year.year };
      console.log(p);
      console.log(year.total);
      year.total[p.yearsKey].forEach(subProp => {
        newYear[subProp.name] = subProp.total;
      });
      return newYear;
    });
    console.log(years);

    return (
      <ResponsiveContainer>
        <BarChart data={years}>
          <XAxis dataKey="year"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          {
            Object.keys(years[0]).map(subProp => {
              console.log(subProp);
              if (subProp === "year") {
                return null;
              }
              return <Bar key={subProp} dataKey={subProp}/>;
            })
          }
        </BarChart>
      </ResponsiveContainer>
    );
  }

  render() {
    const p = this.props;
    let view = null;
    view = (
      <div className="stats-bar_chart">
        {this.renderBarHeader()}
        {this.renderBarChart()}
      </div>
    )

    return view;
  }
}

StatsBar.PropTypes = {
  years: PropTypes.object.isRequired,
  yearsKey: PropTypes.string.isRequired,
}

export default StatsBar;
