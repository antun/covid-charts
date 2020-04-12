import React, { Component } from 'react';

import Chart from '../../components/Chart/Chart/Chart';

import CountrySelector from '../../components/CountrySelector/CountrySelector';

import PopulationSelector from '../../components/PopulationSelector/PopulationSelector';

import DateSelector from '../../components/DateSelector/DateSelector';

import ControlsBox from '../../components/ControlsBox/ControlsBox';

import CovidData from '../../data/CovidData/CovidData';

const covidDataInstance = new CovidData();
const covidData = covidDataInstance.getCovidData();
console.log('covidData', covidData);
const countryData = covidDataInstance.countryData();


class ChartDisplay extends Component {

  state = {
    initialCountries: [
      {Country_Region: 'US', Province_State: ''},
      {Country_Region: 'France', Province_State: ''},
      {Country_Region: 'United Kingdom', Province_State: ''},
      {Country_Region: 'Italy', Province_State: ''},
      {Country_Region: 'Germany', Province_State: ''},
      {Country_Region: 'Spain', Province_State: ''},
      {Country_Region: 'Japan', Province_State: ''}
    ],
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
      const dateOfFirstDeath = covidDataInstance.findDateOfFirstDeath(country, province);
      currentDate = dateOfFirstDeath;
    }
    let day = 0;
    do {
      let xAxisLabel = this.formatDateForChartDisplay(currentDate);
      if (this.state.adjustments.dateAlignmentType === 'firstdeath') {
        xAxisLabel = day;
      }
      const deaths = row[covidDataInstance.formatDate(currentDate)];
      if (!deaths) {
        break;
      }
      data.push([
        xAxisLabel,
        deaths * factor
      ]);
      currentDate = this.getNextDate(currentDate);
      day += 1;
    } while (covidDataInstance.formatDate(currentDate) !== covidDataInstance.formatDate(endDate));
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
      });
    } else {
      // Only on first run copy default countries
      selectedCountries = countryData.filter(country => (
        this.state.initialCountries.findIndex(initialCountry => (country.Country_Region === initialCountry.Country_Region && country.Province_State === initialCountry.Province_State)) > -1
      ));
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
