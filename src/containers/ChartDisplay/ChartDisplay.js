import React, { Component } from 'react';

import Chart from '../../components/Chart/Chart/Chart';

import covidData from '../../data/time_series_covid19_deaths_global.json';



class ChartDisplay extends Component {

  data = [];

  constructor(props) {
    super(props);

    this.data = this.getDataForCountries(['US', 'France', 'United Kingdom', 'Italy', 'Germany', 'Japan']);

      /*
      [
      {
        label: 'United States',
        data: [['2020-02-28' , 0], ['2020-02-29', 0.003056234718826], ['2020-03-01', 0.003056234718826], ['2020-03-02', 0.018337408312959], ['2020-03-03', 0.021393643031785 ]]
      }
    ];
    */
  }

  getNextDate = (previousDate) => {
    const nextDate = new Date(previousDate);
    nextDate.setHours(previousDate.getHours() + 24);
    return nextDate;
  }

  formatDate = (date) => {
    return (date.getUTCMonth()+1) + '/' + date.getUTCDate() + '/' + (date.getUTCFullYear()-2000);
  }

  makeRowForChart = (row, startDate, endDate) => {
    const data = [];
    let currentDate = startDate;
    do {
      data.push([
        this.formatDate(currentDate),
        row[this.formatDate(currentDate)]
      ]);
      console.log(currentDate, currentDate);
      currentDate = this.getNextDate(currentDate);
    } while (this.formatDate(currentDate) !== this.formatDate(endDate));
    const formattedRow = {
      label: row['Country/Region'],
      data: data
    };
    return formattedRow;
  }

  getDataForCountries = (countries) => {
    // console.log(covidData);
    const selectedCountriesRawData = covidData.filter((result, index) => {
      return countries.includes(result['Country/Region']) && result['Province/State'] === '';
    });
    console.log('@selectedCountriesRawData', selectedCountriesRawData);
    const startDate = new Date('2020-01-22 Z');
    const endDate = new Date('2020-03-29 Z');
    // console.log(this.formatDate(startDate));
    // console.log(this.getNextDate(startDate));

    const data = selectedCountriesRawData.map((row) => this.makeRowForChart(row, startDate, endDate));
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
