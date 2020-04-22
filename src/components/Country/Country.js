import React from 'react';

import classes from './Country.module.css';

import { thousandsSeparators } from '../../utils/utils';

const country = (props) => {
  const province = props.country.Province_State ? ' ('+props.country.Province_State+')' : '';
  return(
    <li className={classes.Country}>
      <label>
        <input type="checkbox" onChange={props.onChange} checked={props.checked} />
        {props.country.Country_Region}
        <span className={classes.Province}>{province}</span>
        <span className={classes.Population}>p. ({thousandsSeparators(props.country.Population)})</span>
      </label>
    </li>
  );
}

export default country;
