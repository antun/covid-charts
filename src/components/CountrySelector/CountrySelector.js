import React from 'react';

import Country from '../Country/Country';

const countrySelector = (props) => {
  const countries = props.countries.map(country => (
    <Country key={country.name} country={country.name} onChange={(evt) => props.onCountrySelect(country.name, evt.target.checked)} checked={country.selected} />
  ));
  return (
    <div>
      <h2>Countries</h2>
      <ul>
        {countries}
      </ul>
    </div>
  );
}

export default countrySelector;
