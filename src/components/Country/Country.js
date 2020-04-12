import React from 'react';

import classes from './Country.module.css';

const country = (props) => {
  const province = props.country.Province_State ? ' ('+props.country.Province_State+')' : '';
  return(
    <li className={classes.Country}>
      <label>
        <input type="checkbox" onChange={props.onChange} defaultChecked={props.checked} />
        {props.country.Country_Region}
        {province}
      </label>
    </li>
  );
}

export default country;
