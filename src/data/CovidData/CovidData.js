import rawCovidData from '../time_series_covid19_deaths_global.json';
import rawCountryData from '../UID_ISO_FIPS_LookUp_Table.json';

class CovidData {
  constructor() {
    this.normalizedCountryData = this.normalizeCountryData(rawCountryData);
    this.normalizedCovidData = this.normalizeCovidData(rawCovidData);
  }

  rollupCountries = [
    'Australia',
    'Canada',
    'China',
    'Denmark',
    'France',
    'Netherlands',
    'United Kingdom'
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
    normalized.sort((a,b) => {
      const textA = a.Country_Region.toUpperCase();
      const textB = b.Country_Region.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    return normalized;
  }

  getCovidRows(country, rawCovidData) {
    const covidRows = rawCovidData.filter(el => el['Country/Region'] === country);
    return covidRows;
  }

  isDateColumn(key) {
    return key.match(/[0-9]+\/[0-9]+\/[0-9]+/);
  }

  combineDataForCountries(covidRows) {
    // Find the main row
    console.log('covidRows', covidRows);
    const countryRow = covidRows.filter(row => row['Province/State'] === '');
    console.log('countryRowBefore', countryRow);
    let i;
    for (i=0; i<covidRows.length; i++) {
      const row = covidRows[i];
      if (row['Province/State'] === '') {
        // This is the main country row
        continue;
      }
      for (let k in row) {
        if (this.isDateColumn(k)) {
          countryRow[k] = countryRow[k] * 1 + row[k] * 1;
        }
      }
    }
    console.log('countryRow', countryRow);
    return countryRow;
  }

  normalizeCovidData(rawCovidData) {
    console.log('before', rawCovidData);
    let normalized = [];
    let i;
    for (i=0; i<this.normalizedCountryData.length; i++) {
      const countryRow = this.normalizedCountryData[i];
      const covidRows = this.getCovidRows(countryRow.Country_Region, rawCovidData);
      if (this.rollupCountries.indexOf(countryRow.Country_Region) === -1) {
        if (covidRows.length > 1) {
          console.warn('More than one row found for',countryRow.Country_Region);
        }
        normalized.push(covidRows[0]);
      } else {
        normalized.push(this.combineDataForCountries(covidRows));
      }
    }
    console.log('after', normalized);
    return normalized;
  }

  getCovidData () {
    return this.normalizedCovidData;
  }

  countryData () {
    return this.normalizedCountryData;
  }
  
}



export default CovidData;
