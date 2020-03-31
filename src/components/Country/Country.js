import React from 'react';

const country = (props) => {
  return(
    <div>
      <input type="checkbox" onChange={props.onChange} defaultChecked={country.selected} />
      {props.country}
    </div>
  );
}

export default country;
