import React from 'react';

import classes from './Chart.module.css';

import Chart from 'react-apexcharts';

import defaultColors from '../../../utils/colors';

const chart = (props) => {

  const options = {
    chart: {
      id: 'covidChart'
    },
    xaxis: {
      type: props.xAxisType,
      title: {
        text: props.xAxisTitle,
        offsetY: 11

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
    },
    colors: defaultColors
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
