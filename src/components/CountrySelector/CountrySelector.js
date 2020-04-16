import React from 'react';

import Country from '../Country/Country';
import SelectedCountry from '../SelectedCountry/SelectedCountry';
import classes from './CountrySelector.module.css';
import defaultColors from '../../utils/colors';


const countrySelector = (props) => {
  const countries = props.countries.map(country => (
    <Country key={'country_'+country.Country_Region+'_'+country.Province_State} country={country} onChange={(evt) => props.onCountrySelect(country, evt.target.checked)} checked={country.selected} />
  ));
  const selectedCountries = props.countries.filter(country => ( country.selected === true))
    .map((country, index) => (
      <SelectedCountry key={'selected_' + country.Country_Region + '_' + country.Province_State } 
        country={country} color={defaultColors[index]}
        unselectCountry={(e) => {props.onCountrySelect(country, false)}} />
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
