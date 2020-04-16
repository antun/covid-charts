import React from 'react';

import classes from './Chart.module.css';

import Chart from 'react-apexcharts';

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
    colors: ['#FFB300', '#803E75', '#FF6800', '#A6BDD7', '#C10020', '#CEA262', '#817066', '#007D34', '#F6768E', '#00538A', '#FF7A5C', '#53377A', '#FF8E00', '#B32851', '#F4C800', '#7F180D', '#93AA00', '#593315', '#F13A13', '#232C16']


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
