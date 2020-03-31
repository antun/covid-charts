import React, { Component } from 'react';

import Chart from '../../components/Chart/Chart/Chart';

import CountrySelector from '../../components/CountrySelector/CountrySelector';

import covidData from '../../data/time_series_covid19_deaths_global.json';

import countryPopulation from '../../data/country-by-population.json';

class ChartDisplay extends Component {

  state = {
    countries: [

    ]
  };

  data = [];

  countryMapping = {
    'US': 'United States'
  };

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
    return countryPopulation.filter(e => e.country === countryKey)[0].population;
  }

  makeRowForChart = (row, startDate, endDate, absRel) => {
    const data = [];
    const country = row['Country/Region'];
    let currentDate = startDate;
    let factor = 1;
    if (absRel === 'relative') {
      const population = this.getCountryPopulation(country)
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
    const selectedCountriesRawData = covidData.filter((result, index) => {
      return countries.includes(result['Country/Region']) && result['Province/State'] === '';
    });
    // const startDate = new Date('2020-01-22 Z');
    const startDate = new Date('2020-02-28 Z');
    const endDate = new Date('2020-03-29 Z');

    const data = selectedCountriesRawData.map((row) => this.makeRowForChart(row, startDate, endDate, absRel));

    return data;
  };

  getInitialCountryState = () => {
    return covidData.filter(el => (el['Province/State'] === '')).map(el => ({ name: el['Country/Region'], selected: false}));;
  };

  countryCheckedHandler = (country, selected) => {
    const newResults = this.state.countries.filter((el, index) => {
      const newEl = el;
      if (el.name === country) {
        newEl.selected = selected;
      }
      return newEl;
    });
    this.setState({countries: newResults});
  };
  
  componentDidMount() {
    this.setState({countries: this.getInitialCountryState()});
  }

  render() {
    return (
      <React.Fragment>
        <Chart data={this.data} />
        <CountrySelector countries={this.state.countries} onCountrySelect={this.countryCheckedHandler}/>
      </React.Fragment>
    );
  }
}

export default ChartDisplay;
