import React from 'react';

import classes from './Chart.module.css';

import { Chart } from 'react-charts';

const chart = (props) => {

  const axes = [
    { primary: true, type: 'ordinal', position: 'bottom' },
    { type: 'linear', position: 'left' }
  ];

  return (
    <div className={classes.Chart}
      style={{
        width: '600px',
        height: '300px'
      }} >
      <Chart data={props.data} axes={axes} tooltip />
    </div>
  );
};

export default chart;
