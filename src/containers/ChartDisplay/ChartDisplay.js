import React, { Component } from 'react';

import Chart from '../../components/Chart/Chart/Chart';

import covidData from '../../data/time_series_covid19_deaths_global.json';

import countryPopulation from '../../data/country-by-population.json';

class ChartDisplay extends Component {

  data = [];

  countryMapping = {
    'US': 'United States'
  }

  constructor(props) {
    super(props);

    this.data = this.getDataForCountries(['US', 'France', 'United Kingdom', 'Italy', 'Germany', 'Japan'], 'relative');
  }

  getNextDate = (previousDate) => {
    const nextDate = new Date(previousDate);
    nextDate.setHours(previousDate.getHours() + 24);
    return nextDate;
  }

  formatDate = (date) => {
    return (date.getUTCMonth()+1) + '/' + date.getUTCDate() + '/' + (date.getUTCFullYear()-2000);
  }

  formatDateForChartDisplay = (date) => {
    return (date.getUTCMonth()+1) + '/' + date.getUTCDate()
  }

  getCountryPopulation = (country) => {
    let countryKey = country;
    if (this.countryMapping.hasOwnProperty(country)) {
      countryKey = this.countryMapping[country];
    }
    console.log('countryPopulation', countryPopulation);
    console.log(countryPopulation.filter(e => e.country === countryKey)[0].population);
    return countryPopulation.filter(e => e.country === countryKey)[0].population;
  }

  makeRowForChart = (row, startDate, endDate, absRel) => {
    const data = [];
    const country = row['Country/Region'];
    let currentDate = startDate;
    let factor = 1;
    if (absRel === 'relative') {
      const population = this.getCountryPopulation(country)
      console.log('population', population);
      console.log('country', country);
      factor = 1000000/population;
    }
    do {
      const deaths = row[this.formatDate(currentDate)];
      data.push([
        this.formatDateForChartDisplay(currentDate),
        deaths * factor
      ]);
      currentDate = this.getNextDate(currentDate);
    } while (this.formatDate(currentDate) !== this.formatDate(endDate));
    const formattedRow = {
      label: country,
      data: data
    };
    return formattedRow;
  }

  getDataForCountries = (countries, absRel) => {
    // console.log(covidData);
    const selectedCountriesRawData = covidData.filter((result, index) => {
      return countries.includes(result['Country/Region']) && result['Province/State'] === '';
    });
    // const startDate = new Date('2020-01-22 Z');
    const startDate = new Date('2020-02-12 Z');
    const endDate = new Date('2020-03-29 Z');

    const data = selectedCountriesRawData.map((row) => this.makeRowForChart(row, startDate, endDate, absRel));
    console.log('data', data);

    return data;
  };

  render() {
    return (
      <Chart data={this.data} />
    );
  }
}

export default ChartDisplay;
