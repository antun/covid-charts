import queryString from 'query-string';

const getCountriesFromQuerystring = (rawString) => {
  const qs = queryString.parse(rawString);
  if (qs.countries) {
    return JSON.parse(qs.countries);
  } else {
    return [];
  }
};

const getAdjustmentsFromQuerystring = (rawString) => {
  const qs = queryString.parse(rawString);
  if (qs.adjustments) {
    return JSON.parse(qs.adjustments);
  } else {
    return null;
  }
};

const makeNewQueryString = (rawString, selectedCountries, adjustments) => {
  const qs = queryString.parse(rawString);
  const simplified = selectedCountries.map(el => {return {Country_Region: el.Country_Region, Province_State: el.Province_State}});
  return queryString.stringify({
    ...qs,
    countries: JSON.stringify(simplified),
    adjustments: JSON.stringify(adjustments)
  });
};

export {
  getCountriesFromQuerystring,
  getAdjustmentsFromQuerystring,
  makeNewQueryString
};


