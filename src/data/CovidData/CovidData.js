import rawDeathData from '../time_series_covid19_deaths_global.json';
import rawCountryData from '../UID_ISO_FIPS_LookUp_Table.json';
import * as Utils from '../../utils/utils';

class CovidData {
  constructor() {
    this.normalizedCountryData = this.normalizeCountryData(rawCountryData);
    this.normalizedDeathData = this.normalizeDeathData(rawDeathData);
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

  _getRawDeathRow(country, province, rawDeathData) {
    const deathRow = rawDeathData.filter(el => el['Country/Region'] === country && el['Province/State'] === province);
    if (deathRow.length > 1) {
      console.warn('more than one row found for,', country, province);
    }
    return deathRow[0];
  }

  isDateColumn(key) {
    return key.match(/[0-9]+\/[0-9]+\/[0-9]+/);
  }

  // Country_Region,Province_State
  getDeathRowForCountry(country, province) {
    const row = this.normalizedDeathData.filter(row => (row['Province/State'] === province && row['Country/Region'] === country))[0];
    return row;
  }

  combineDataForCountries(deathRows) {
    // Find the main row
    const countryRow = deathRows.filter(row => row['Province/State'] === '');
    let i;
    for (i=0; i<deathRows.length; i++) {
      const row = deathRows[i];
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

  normalizeDeathData(rawDeathData) {
    let normalized = [];
    let i;
    for (i=0; i<this.normalizedCountryData.length; i++) {
      const countryRow = this.normalizedCountryData[i];
      if (this.treatAsProvinces.indexOf(countryRow.Country_Region) === -1) {
        const deathRow = this._getRawDeathRow(countryRow.Country_Region, countryRow.Province_State, rawDeathData);
        normalized.push(deathRow);
      } else {
        // This is a province
        if (countryRow.Province_State === '') {
          continue;
        }
        const provinceRow = this._getRawDeathRow(countryRow.Country_Region, countryRow.Province_State, rawDeathData);
        if (provinceRow) {
          normalized.push(provinceRow);
        } else {
          console.warn('Could not find province row for', countryRow.Country_Region, countryRow.Province_State);
        }
      }
    }
    return normalized;
  }

  formatDate (date) {
    return (date.getUTCMonth()+1) + '/' + date.getUTCDate() + '/' + (date.getUTCFullYear()-2000);
  }

  findDateOfNthDeath (country, province, n) {
    const row = this.normalizedDeathData.filter(el => el['Country/Region'] === country && el['Province/State'] === province)[0];
    let currentDate = new Date('2020-01-22'); // Data begins on this date
    const endDate = new Date();
    endDate.setUTCHours(-1);
    do {
      const deaths = 1*(row[this.formatDate(currentDate)]);
      if (deaths >= n) {
        return currentDate;
      }
      currentDate = Utils.getNextDate(currentDate);
    } while (this.formatDate(currentDate) !== this.formatDate(endDate));
  }

  getDeathData () {
    return this.normalizedDeathData;
  }

  countryData () {
    return this.normalizedCountryData;
  }
  
}

export default CovidData;
