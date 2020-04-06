import React from 'react';

import classes from './Country.module.css';

const country = (props) => {
  return(
    <li className={classes.Country}>
      <label>
        <input type="checkbox" onChange={props.onChange} defaultChecked={props.checked} />
        {props.country}
      </label>
    </li>
  );
}

export default country;
