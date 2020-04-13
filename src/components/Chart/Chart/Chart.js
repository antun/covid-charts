import React from 'react';

import classes from './Chart.module.css';

import Chart from 'react-apexcharts';

const chart = (props) => {

  const options = {
    chart: {
      id: 'covidChart'
    },
    xaxis: {
      type: 'numeric',
      title: {
        text: props.xAxisTitle
      }
    },
    yaxis: {
      decimalsInFloat: 0,
      title: {
        text: props.yAxisTitle
      }
    },
    stroke: {
      show: true,
      width: 2,
      dashArray: 0
    }
  };

  return (
    <div className={classes.Chart}
      style={{
        width: '600px',
        height: '300px'
      }} >

      <Chart options={options} series={props.data} type="line" height={320} />
    </div>
  );
};

export default chart;
