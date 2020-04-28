import React from 'react';

import Switch from 'react-switch';

import classes from './DataPopSelector.module.css';


const dataPopSelector = (props) => {
  const msg = props.relative ? 'Showing statistics relative to population size' : 'Showing absolute statistics';

  return (
    <div className={classes.PopulationSelector}>
      <h3>Relative to Population</h3>
      <Switch onChange={props.onSelect} checked={props.relative} />
      <div>
        {msg}
      </div>
    </div>

  );

};


export default dataPopSelector;
