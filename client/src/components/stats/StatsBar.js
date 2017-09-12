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
import {
  Icon,
} from 'semantic-ui-react';
import ReactTooltip from 'react-tooltip';

const BAR_COLORS_DIVERGING = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928",
];

const BAR_COLORS_SEQUENTIAL = [
  "#fff7fb",
  "#ece7f2",
  "#d0d1e6",
  "#a6bddb",
  "#74a9cf",
  "#3690c0",
  "#0570b0",
  "#045a8d",
  "#023858",
  "#000000",
]

class StatsBar extends React.Component {

  constructor(props) {
    super(props);
    this.renderBarChart = this.renderBarChart.bind(this);
  }

  renderBarHeader() {
    return (
      <h2>
        Appearances by Year and {this.props.title}
        <Icon color="red" name="warning sign" data-tip data-for={`stats-bar-warning-${this.props.title}`}/>
        <ReactTooltip effect='solid' place='right' type='error' id={`stats-bar-warning-${this.props.title}`}>
          Likely to vary due to tournament coverage in QuizDB.
          Take numbers with a grain of salt!
        </ReactTooltip>
      </h2>
    );
  }

  renderBarChart(){
    const p = this.props;
    const years = p.years.map(year => {
      const newYear = { year: year.year };
      year.total[p.yearsKey].forEach(subProp => {
        newYear[subProp.name] = subProp.total;
      });
      return newYear;
    });

    const colors = (p.yearsKey === "categories") ? BAR_COLORS_DIVERGING : BAR_COLORS_SEQUENTIAL;

    return (
      <ResponsiveContainer>
        <BarChart data={years}>
          <XAxis dataKey="year"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          {
            Object.keys(years[0]).map((subProp, index) => {
              if (subProp === "year") {
                return null;
              }
              return <Bar
                key={subProp}
                dataKey={subProp}
                stackId={"a"}
                fill={colors[index % colors.length]}
              />;
            })
          }
          <Legend height={60}/>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  render() {
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
  title: PropTypes.string.isRequired,
}

export default StatsBar;
