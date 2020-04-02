import React from 'react';

const country = (props) => {
  return(
    <li>
      <input type="checkbox" onChange={props.onChange} defaultChecked={country.selected} />
      {props.country}
    </li>
  );
}

export default country;
