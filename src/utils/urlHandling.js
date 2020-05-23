import queryString from 'query-string';

const getCountriesFromQuerystring = (rawString) => {
  const qs = queryString.parse(rawString);
  if (qs.countries) {
    return JSON.parse(qs.countries);
  } else {
    return [];
  }
};

const makeNewQueryString = (rawString, selectedCountries) => {
  const qs = queryString.parse(rawString);
  const simplified = selectedCountries.map(el => {return {Country_Region: el.Country_Region, Province_State: el.Province_State}});
  return queryString.stringify({...qs, countries: JSON.stringify(simplified)});
};

export {
  getCountriesFromQuerystring,
  makeNewQueryString
};


