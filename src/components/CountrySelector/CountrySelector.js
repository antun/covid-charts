import React from 'react';

import Country from '../Country/Country';
import classes from './CountrySelector.module.css';

const countrySelector = (props) => {
  const countries = props.countries.map(country => (
    <Country key={country.name} country={country.name} onChange={(evt) => props.onCountrySelect(country.name, evt.target.checked)} checked={country.selected} />
  ));
  return (
    <div className={classes.CountrySelector}>
      <h3>Countries</h3>
      <ul>
        {countries}
      </ul>
    </div>
  );
}

export default countrySelector;
