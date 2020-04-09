import React from 'react';

import Country from '../Country/Country';
import SelectedCountry from '../SelectedCountry/SelectedCountry';
import classes from './CountrySelector.module.css';


const countrySelector = (props) => {
  const countries = props.countries.map(country => (
    <Country key={country.name} country={country.name} onChange={(evt) => props.onCountrySelect(country.name, evt.target.checked)} checked={country.selected} />
  ));
  const selectedCountries = props.countries.filter(country => ( country.selected === true)).map(
    country => (
      <SelectedCountry key={country.name} country={country} unselectCountry={(e) => {props.onCountrySelect(country.name, false)}} />
    )
  );
  return (
    <div className={classes.CountrySelector}>
      <h3>Countries</h3>
      <div className={classes.SelectedContainer}>
        {selectedCountries}
      </div>
      <div className={classes.CountryListContainer}>
        <ul>
          {countries}
        </ul>
      </div>
    </div>
  );
}

export default countrySelector;
