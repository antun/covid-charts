import React from 'react';
import classes from './SelectedCountry.module.css';

const selectedCountry = (props) => {
  const province = props.country.Province_State !== '' ? '('+props.country.Province_State+')' : '';
  return (
    <div className={classes.SelectedCountry} style={{backgroundColor: props.color}}>
      {props.country.Country_Region}
      {province}
      &nbsp;
      <button onClick={props.unselectCountry}>
        x
      </button>
    </div>
  );
};

export default selectedCountry;
