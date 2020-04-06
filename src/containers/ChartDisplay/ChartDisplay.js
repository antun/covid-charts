import React, { Component } from 'react';

import Chart from '../../components/Chart/Chart/Chart';

import CountrySelector from '../../components/CountrySelector/CountrySelector';

import PopulationSelector from '../../components/PopulationSelector/PopulationSelector';

import ControlsBox from '../../components/ControlsBox/ControlsBox';

import covidData from '../../data/time_series_covid19_deaths_global.json';

import countryPopulation from '../../data/country-by-population.json';

class ChartDisplay extends Component {

  state = {
    initialCountries: ['US', 'France', 'United Kingdom', 'Italy', 'Germany', 'Japan'],
    adjustments: {
      relativeToPopulation: false
    },
    countries: [

    ],
    chartData: []
  };

  countryMapping = {
    'US': 'United States',
    'Russia': 'Russian Federation',
    'Serbia': 'Yugoslavia',
    'Taiwan*': 'Taiwan'
  };


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

  makeRowForChart = (row, startDate, endDate) => {
    const data = [];
    const country = row['Country/Region'];
    let currentDate = startDate;
    let factor = 1;
    if (this.state.adjustments.relativeToPopulation) {
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

  makeChartData = () => {
    let selectedCountries;
    if (!this.state.initialCountries) {
      selectedCountries = this.state.countries.filter(el => {
        return el.selected === true;
      }).map(el => el.name);
    } else {
      // Only on first run
      selectedCountries = this.state.initialCountries;
    }
    console.log('selectedCountries', selectedCountries);
    const selectedCountriesRawData = covidData.filter((result, index) => {
      return selectedCountries.includes(result['Country/Region']) && result['Province/State'] === '';
    });
    // const startDate = new Date('2020-01-22 Z');
    const startDate = new Date('2020-02-28 Z');
    const endDate = new Date();
    endDate.setUTCHours(-1);
    const data = selectedCountriesRawData.map((row) => this.makeRowForChart(row, startDate, endDate));

    return data;
  };

  getInitialCountryState = () => {
    return covidData.filter(el => (el['Province/State'] === '')).map(el => ({ name: el['Country/Region'], selected: this.state.initialCountries.includes(el['Country/Region'])}));;
  };

  getSelectedCountries = () => {
    return this.state.countries.filter(el => el.selected).map(el => el.name);
  };

  countryCheckedHandler = (country, selected) => {
    const newResults = this.state.countries.filter((el, index) => {
      const newEl = el;
      if (el.name === country) {
        newEl.selected = selected;
      }
      return newEl;
    });
    this.setState({countries: newResults, chartData: this.makeChartData()});
  };

  populationHandler = (newValue) => {
    this.setState({adjustments: {relativeToPopulation: newValue}}, this.refreshChart);
  }

  refreshChart = () => {
    this.setState({chartData: this.makeChartData()});
  }
  
  componentDidMount() {
    const initialState = {
      initialCountries: null,
      countries: this.getInitialCountryState(),
      chartData: this.makeChartData() 
    };
    this.setState(initialState);
  }

  render() {
    return (
      <React.Fragment>
        <Chart data={this.state.chartData} />
        <ControlsBox>
          <CountrySelector countries={this.state.countries} onCountrySelect={this.countryCheckedHandler}/>
        </ControlsBox>
        <ControlsBox>
          <PopulationSelector relative={this.state.adjustments.relativeToPopulation} onSelect={this.populationHandler} />
        </ControlsBox>
      </React.Fragment>
    );
  }
}

export default ChartDisplay;
