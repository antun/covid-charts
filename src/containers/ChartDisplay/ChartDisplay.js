import React, { Component } from 'react';

import Chart from '../../components/Chart/Chart/Chart';

class ChartDisplay extends Component {

  data = [];

  constructor(props) {
    super(props);

    this.data = [
      {
        label: 'United States',
        data: [['2020-02-28' , 0], ['2020-02-29', 0.003056234718826], ['2020-03-01', 0.003056234718826], ['2020-03-02', 0.018337408312959], ['2020-03-03', 0.021393643031785 ]]
      }
    ];
  }

  render() {
    return (
      <Chart data={this.data} />
    );
  }
}

export default ChartDisplay;
