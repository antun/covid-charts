import React from 'react';
import classes from './SelectedCountry.module.css';

const selectedCountry = (props) => {
  return (
    <div className={classes.SelectedCountry}>
      {props.country.name}
      &nbsp;
      <button onClick={props.unselectCountry}>
        x
      </button>
    </div>
  );
};

export default selectedCountry;
