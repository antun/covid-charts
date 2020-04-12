import rawCovidData from '../time_series_covid19_deaths_global.json';
import rawCountryData from '../UID_ISO_FIPS_LookUp_Table.json';

class CovidData {
  constructor() {
    this.normalizedCountryData = this.normalizeCountryData(rawCountryData);
    this.normalizedCovidData = this.normalizeCovidData(rawCovidData);
  }

  treatAsProvinces = [
    'Australia',
    'Canada',
    'China'
  ];

  rollupCountries = [
  ];

  normalizeCountryData(rawCountryData) {
    let normalized = [];
    let i;
    for (i=0; i<rawCountryData.length; i++) {
      let el = rawCountryData[i];
      if (this.treatAsProvinces.indexOf(el.Country_Region) > -1 && el.Province_State === '' ) {
        // Skip countries that we're treating as provinces but that also have a country line
        continue;
      }
      if (el.Country_Region === 'US' && (el.Province_State !== '' || el.Admin2 !== '')) {
        // Clear any that have non-blank Admin2 values. These seem to be
        // counties in the US
        continue;
      }
      normalized.push(el);
    }
    normalized.sort((a,b) => {
      const textA = a.Country_Region.toUpperCase();
      const textB = b.Country_Region.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    return normalized;
  }

  _getRawCovidRows(country, rawCovidData) {
    const covidRows = rawCovidData.filter(el => el['Country/Region'] === country);
    return covidRows;
  }

  _getRawCovidRow(country, province, rawCovidData) {
    const covidRow = rawCovidData.filter(el => el['Country/Region'] === country && el['Province/State'] === province);
    if (covidRow.length > 1) {
      console.warn('more than one row found for,', country, province);
    }
    return covidRow[0];
  }

  isDateColumn(key) {
    return key.match(/[0-9]+\/[0-9]+\/[0-9]+/);
  }

  // Country_Region,Province_State
  getCovidRowForCountry(country, province) {
    const row = this.normalizedCovidData.filter(row => (row['Province/State'] === province && row['Country/Region'] === country))[0];
    return row;
  }

  combineDataForCountries(covidRows) {
    // Find the main row
    const countryRow = covidRows.filter(row => row['Province/State'] === '');
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
    return countryRow;
  }

  normalizeCovidData(rawCovidData) {
    let normalized = [];
    let i;
    for (i=0; i<this.normalizedCountryData.length; i++) {
      const countryRow = this.normalizedCountryData[i];
      if (this.treatAsProvinces.indexOf(countryRow.Country_Region) === -1) {
        // const covidRows = this._getRawCovidRows(countryRow.Country_Region, rawCovidData);
        const covidRow = this._getRawCovidRow(countryRow.Country_Region, countryRow.Province_State, rawCovidData);
        normalized.push(covidRow);
      } else {
        // This is a province
        if (countryRow.Province_State === '') {
          continue;
        }
        const provinceRow = this._getRawCovidRow(countryRow.Country_Region, countryRow.Province_State, rawCovidData);
        if (provinceRow) {
          normalized.push(provinceRow);
        } else {
          console.warn('Could not find province row for', countryRow.Country_Region, countryRow.Province_State);
        }
      }
    }
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
