import React from 'react';

import classes from './ControlsBox.module.css';

const controlsBox = props => (
  <div className={classes.ControlsBox}>
    {props.children}
  </div>
);

export default controlsBox;
