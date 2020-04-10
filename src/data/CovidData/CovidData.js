import timeSeries from '../time_series_covid19_deaths_global.json';
import rawCountryData from '../UID_ISO_FIPS_LookUp_Table.json';

class CovidData {
  constructor() {
    this.normalizedCountryData = this.normalizeCountryData(rawCountryData);
  }

  static rollupCountries = [
    'Australia',
    'Canada',
    'China'
  ];

  normalizeCountryData(rawCountryData) {
    let normalized = [];
    let i;
    for (i=0; i<rawCountryData.length; i++) {
      let el = rawCountryData[i];
      // Clear any that have non-blank Admin2 values. These seem to be
      // counties in the US
      if (el.Admin2 === '' && el.Province_State === '') {
        normalized.push(el);
      }
    }
    return normalized;
  }

  getCovidData () {
    return timeSeries;
  }

  countryData () {
    return this.normalizedCountryData;
  }
  
}



export default CovidData;
