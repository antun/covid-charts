import React, { Component } from 'react';

import Chart from '../../components/Chart/Chart/Chart';

import CountrySelector from '../../components/CountrySelector/CountrySelector';

import PopulationSelector from '../../components/PopulationSelector/PopulationSelector';

import DateSelector from '../../components/DateSelector/DateSelector';

import ControlsBox from '../../components/ControlsBox/ControlsBox';

import CovidData from '../../data/CovidData/CovidData';

const covidDataInstance = new CovidData();
const covidData = covidDataInstance.getCovidData();
const countryData = covidDataInstance.countryData();


class ChartDisplay extends Component {

  state = {
    //initialCountries: ['US', 'France', 'United Kingdom', 'Italy', 'Germany', 'Japan'],
    //initialCountries: ['US', 'France', 'United Kingdom', 'Italy', 'Germany', 'Japan'],
    initialCountries: [{Country_Region: 'US', Province_State: '', Population: "329466283"}],
    adjustments: {
      relativeToPopulation: true,
      dateAlignmentType: 'exact'
    },
    countries: [

    ],
    chartData: []
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
    return 1*countryData.filter(e => e.Country_Region === country)[0].Population;
  }

  makeRowForChart = (country, province, startDate, endDate) => {
    const row = covidDataInstance.getCovidRowForCountry(country, province);
    const data = [];
    let currentDate = startDate;
    let factor = 1;
    if (this.state.adjustments.relativeToPopulation) {
      const population = this.getCountryPopulation(country)
      factor = 1000000/population;
    }
    if (this.state.adjustments.dateAlignmentType === 'firstdeath') {
      const dateOfFirstDeath = this.findDateOfFirstDeath(country);
      currentDate = dateOfFirstDeath;
    }
    let day = 0;
    do {
      let xAxisLabel = this.formatDateForChartDisplay(currentDate);
      if (this.state.adjustments.dateAlignmentType === 'firstdeath') {
        xAxisLabel = day;
      }
      const deaths = row[this.formatDate(currentDate)];
      if (!deaths) {
        break;
      }
      data.push([
        xAxisLabel,
        deaths * factor
      ]);
      currentDate = this.getNextDate(currentDate);
      day += 1;
    } while (this.formatDate(currentDate) !== this.formatDate(endDate));
    const formattedRow = {
      label: country,
      data: data
    };
    return formattedRow;
  }

  findDateOfFirstDeath = (country) => {
    const row = covidData.filter(el => el['Country/Region'] === country && el['Province/State'] === '')[0];
    let currentDate = new Date('2020-01-22'); // Data begins on this date
    const endDate = new Date();
    endDate.setUTCHours(-1);
    do {
      const deaths = 1*(row[this.formatDate(currentDate)]);
      if (deaths > 0) {
        return currentDate;
      }
      currentDate = this.getNextDate(currentDate);
    } while (this.formatDate(currentDate) !== this.formatDate(endDate));
  }

  makeChartData = () => {
    let selectedCountries;
    if (!this.state.initialCountries) {
      selectedCountries = this.state.countries.filter(el => {
        return el.selected === true;
      });
    } else {
      // Only on first run
      // TODO: This actually should *copy* the objects INCLUDING
      // population
      selectedCountries = this.state.initialCountries;
    }
    // const startDate = new Date('2020-01-22');
    let startDate = new Date('2020-02-28');
    const endDate = new Date();
    endDate.setUTCHours(-1);
    const data = selectedCountries.map((row) => {
      return this.makeRowForChart(row.Country_Region, row.Province_State, startDate, endDate);
    });

    return data;
  };

  getInitialCountryState = () => {
    return countryData.map(el => (
      {...el, selected: this.state.initialCountries.find(initialCountry => (
        el.Country_Region === initialCountry.Country_Region
          && el.Province_State === initialCountry.Province_State
          )
        ) !== undefined}
      )
    );
  };

  getSelectedCountries = () => {
    return this.state.countries.filter(el => el.selected);
  };

  countryCheckedHandler = (country, selected) => {
    const newResults = this.state.countries.filter((el, index) => {
      const newEl = el;
      if (el.Country_Region === country.Country_Region && el.Province_State === country.Province_State) {
        newEl.selected = selected;
      }
      return newEl;
    });
    this.setState({countries: newResults, chartData: this.makeChartData()});
  };

  populationHandler = (newValue) => {
    this.setState({adjustments: {...this.state.adjustments, relativeToPopulation: newValue}}, this.refreshChart);
  }

  dateAlignmentHandler = e => {
    this.setState({adjustments: {...this.state.adjustments, dateAlignmentType: e.target.value}}, this.refreshChart);
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
        <ControlsBox>
          <DateSelector dateAlignment={this.state.adjustments.dateAlignmentType} 
                        onDateAlignmentTypeChange={this.dateAlignmentHandler} />
        </ControlsBox>
      </React.Fragment>
    );
  }
}

export default ChartDisplay;
