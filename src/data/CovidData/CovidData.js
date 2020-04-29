import rawGlobalDeathData from '../time_series_covid19_deaths_global.json';
import rawUSDeathData from '../time_series_covid19_deaths_US.json';
import rawGlobalConfirmedData from '../time_series_covid19_confirmed_global.json';
import rawUSConfirmedData from '../time_series_covid19_confirmed_US.json';
import rawCountryData from '../UID_ISO_FIPS_LookUp_Table.json';
import usStates from './config.usstates.js';
import dataAsProvinces from './config.dataasprovinces.js';
import * as Utils from '../../utils/utils';

class CovidData {
  constructor() {
    this.normalizedCountryData = this.normalizeCountryData(rawCountryData);
    this.normalizedDeathData = this.normalizeTimeSeriesData(rawGlobalDeathData, rawUSDeathData);
    this.normalizedConfirmedData = this.normalizeTimeSeriesData(rawGlobalConfirmedData, rawUSConfirmedData);
  }


  normalizeCountryData(rawCountryData) {
    let normalized = [];
    let i;
    for (i=0; i<rawCountryData.length; i++) {
      let el = rawCountryData[i];
      if (el.Country_Region === 'US' && (el.Province_State !== '' &&  usStates.indexOf(el.Province_State) === -1)) {
        // Skip any non-State US entities
        continue;
      }
      if (dataAsProvinces.hasOwnProperty(el.Country_Region) && el.Province_State !== '' && dataAsProvinces[el.Country_Region].indexOf(el.Province_State) === -1) {
        // Skip any that belong to countries for which we get province data,
        // and the province is not a real province - e.g. there were some
        // cruise ships for Canada
        continue;
      }
      if (el.Country_Region === 'US' && (el.Admin2 !== '')) {
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

  _getRawRow(country, province, rawGlobalDeathData) {
    const deathRow = rawGlobalDeathData.filter(el => el['Country/Region'] === country && el['Province/State'] === province);
    if (deathRow.length > 1) {
      console.warn('more than one row found for,', country, province);
    }
    return deathRow[0];
  }

  _getRawRows(country, rawTimeSeriesData) {
    const rows = rawTimeSeriesData.filter(el => el['Country/Region'] === country && el['Province/State'] !== '');
    return rows;
  }

  // For some reason, the US data has different headings than the global data
  _getRawUSRows(country, province, rawUSDeathData) {
    const deathRow = rawUSDeathData.filter(el => el['Country_Region'] === country && el['Province_State'] === province);
    return deathRow;
  }

  _isDateColumn(key) {
    return key.match(/[0-9]+\/[0-9]+\/[0-9]+/);
  }

  // Country_Region,Province_State
  getDeathRowForCountry(country, province) {
    const row = this.normalizedDeathData.filter(row => (row['Province/State'] === province && row['Country/Region'] === country))[0];
    return row;
  }

  getConfirmedRowForCountry(country, province) {
    const row = this.normalizedConfirmedData.filter(row => (row['Province/State'] === province && row['Country/Region'] === country))[0];
    return row;
  }

  getCountryPopulation = (country, province) => {
    return 1*this.normalizedCountryData.filter(e => (e.Country_Region === country && e.Province_State === province))[0].Population;
  }

  _combineDataForState(countyRows, stateName) {
    const stateRow = {
      Admin2: '',
      Combined_Key: stateName + ', US',
      Country_Region: 'US',
      'Country/Region': 'US',
      FIPS: null,
      Lat: null,
      Long_: null,
      Population: 0,
      Province_State: stateName,
      'Province/State': stateName,
      UID: '',
      code3: '',
      iso2: 'US',
      iso3: 'USA'
    };
    let i;
    for (i=0; i<countyRows.length; i++) {
      const row = countyRows[i];
      for (let k in row) {
        if (this._isDateColumn(k)) {
          if (stateRow[k]) {
            stateRow[k] = stateRow[k] + row[k] * 1;
          } else {
            stateRow[k] = row[k] * 1;
          }
        } else if (k === 'Population') {
            stateRow[k] = stateRow[k] + row[k] * 1;
        }
      }
    }
    return stateRow;
  }

  _combineDataForCountry(provinceRows, countryName) {
    const countryRow = {
      Admin2: '',
      Combined_Key: countryName,
      Country_Region: countryName,
      'Country/Region': countryName,
      FIPS: null,
      Lat: null,
      Long_: null,
      Population: 0,
      Province_State: '',
      'Province/State': '',
      UID: '',
      code3: '',
      iso2: '--',
      iso3: '---'
    };
    let i;
    for (i=0; i<provinceRows.length; i++) {
      const row = provinceRows[i];
      for (let k in row) {
        if (this._isDateColumn(k)) {
          if (countryRow[k]) {
            countryRow[k] = countryRow[k] + row[k] * 1;
          } else {
            countryRow[k] = row[k] * 1;
          }
        } else if (k === 'Population') {
            countryRow[k] = countryRow[k] + row[k] * 1;
        }
      }
    }
    return countryRow;
  }

  normalizeTimeSeriesData(rawGlobalTimeSeriesData, rawUSTimeSeriesData) {
    let normalized = [];
    let i;
    for (i=0; i<this.normalizedCountryData.length; i++) {
      const countryRow = this.normalizedCountryData[i];
      if (!dataAsProvinces.hasOwnProperty(countryRow.Country_Region)) {
        // Regular country (or US state)
        let row;
        if (countryRow.Country_Region === 'US' && countryRow.Province_State !== '') {
          // US State - needs to be rolled-up
          const counties = this._getRawUSRows(countryRow.Country_Region, countryRow.Province_State, rawUSTimeSeriesData);
          row = this._combineDataForState(counties, countryRow.Province_State);
        } else {
          // Regular country
          row = this._getRawRow(countryRow.Country_Region, countryRow.Province_State, rawGlobalTimeSeriesData);
        }
        normalized.push(row);
      } else {
        // Country for which only province info is provided
        let row;
        if (countryRow.Province_State !== '') {
          // Province
          row = this._getRawRow(countryRow.Country_Region, countryRow.Province_State, rawGlobalTimeSeriesData);
        } else {
          // Top-level entity (e.g. Canada) - roll-up
          const provinces = this._getRawRows(countryRow.Country_Region, rawGlobalTimeSeriesData);
          row = this._combineDataForCountry(provinces, countryRow.Country_Region);
        }
        if (row) {
          normalized.push(row);
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

  findDateOfNth (country, province, n, dataToUse) {
    let data;
    if (dataToUse === 'death') {
      data = this.normalizedDeathData;
    } else if (dataToUse === 'case') {
      data = this.normalizedConfirmedData;
    } else {
      console.warn('Invalid data type:', dataToUse);
    }
    const row = data.filter(el => el['Country/Region'] === country && el['Province/State'] === province)[0];
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
