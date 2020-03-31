import React from 'react';

import { Chart } from 'react-charts';

const chart = (props) => {

  const axes = [
    { primary: true, type: 'ordinal', position: 'bottom' },
    { type: 'linear', position: 'left' }
  ];

  return (
    <div
      style={{
        width: '600px',
        height: '300px'
      }} >
      <Chart data={props.data} axes={axes} tooltip />
    </div>
  );
};

export default chart;
