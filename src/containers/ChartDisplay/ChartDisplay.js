import React, { Component } from 'react';

import Chart from '../../components/Chart/Chart/Chart';

import CountrySelector from '../../components/CountrySelector/CountrySelector';

import PopulationSelector from '../../components/PopulationSelector/PopulationSelector';

import DateSelector from '../../components/DateSelector/DateSelector';

import ControlsBox from '../../components/ControlsBox/ControlsBox';

import CovidData from '../../data/CovidData/CovidData';

import * as Utils from '../../utils/utils';

const covidDataInstance = new CovidData();
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
      dateAlignmentType: 'exact',
      dateAlignmentDeathOffset: 1,
      dateAlignmentCaseOffset: 1
    },
    countries: [

    ],
    chartData: [],
    xAxisTitle: 'Date',
    yAxisTitle: 'Deaths / 1M Population'

  };


  formatDateForChartDisplay = (date) => {
    // This will get converted by the chart
    return 1900+date.getYear() + '-' + (date.getUTCMonth()+1) + '-' + date.getUTCDate()
  }

  getCountryPopulation = (country) => {
    return 1*countryData.filter(e => e.Country_Region === country)[0].Population;
  }

  makeRowForChart = (country, province, startDate, endDate) => {
    const row = covidDataInstance.getDeathRowForCountry(country, province);
    const data = [];
    let currentDate = startDate;
    let factor = 1;
    if (this.state.adjustments.relativeToPopulation) {
      const population = this.getCountryPopulation(country)
      factor = 1000000/population;
    }
    if (this.state.adjustments.dateAlignmentType === 'nthdeath') {
      const dateOfFirstDeath = covidDataInstance.findDateOfNth(country, province, this.state.adjustments.dateAlignmentDeathOffset, 'death');
      currentDate = dateOfFirstDeath;
    } else if (this.state.adjustments.dateAlignmentType === 'nthcase') {
      const dateOfFirstCase = covidDataInstance.findDateOfNth(country, province, this.state.adjustments.dateAlignmentCaseOffset, 'case');
      currentDate = dateOfFirstCase;
    }
    let day = 0;
    do {
      let xAxisLabel = this.formatDateForChartDisplay(currentDate);
      if (this.state.adjustments.dateAlignmentType === 'nthdeath'
        || this.state.adjustments.dateAlignmentType === 'nthcase') {
        xAxisLabel = day;
      }
      const deaths = row[covidDataInstance.formatDate(currentDate)];
      if (!deaths) {
        break;
      }
      data.push({
        x: xAxisLabel,
        y: deaths * factor
      });
      currentDate = Utils.getNextDate(currentDate);
      day += 1;
    } while (covidDataInstance.formatDate(currentDate) !== covidDataInstance.formatDate(endDate));
    const formattedRow = {
      name: country,
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
    this.setState({
      countries: newResults,
      chartData: this.makeChartData()
    });
    let countryLabel = country.Province_State ? ' ('+country.Province_State+')' : '';
    countryLabel = country.Country_Region + countryLabel;
    window.gtag('event', 'select', {
      event_category: 'Country',
      event_label: countryLabel
    });
  };

  getXAxisTitle = () => {
    let label, dayCount, ordinalSuffix;
    switch (this.state.adjustments.dateAlignmentType) {
      case 'exact':
        label = 'Date';
        break;
      case 'nthdeath':
        dayCount = this.state.adjustments.dateAlignmentDeathOffset;
        ordinalSuffix = Utils.getOrdinalSuffix(dayCount);
        label = `Days since ${dayCount}${ordinalSuffix} death `;
        break;
      case 'nthcase':
        dayCount = this.state.adjustments.dateAlignmentCaseOffset;
        ordinalSuffix = Utils.getOrdinalSuffix(dayCount);
        label = `Days since ${dayCount}${ordinalSuffix} confirmed case `;
        break;
      default:
        label = 'Date'
        break;
    }
    return label;
  }

  getYAxisTitle = () => {
    let label;
    switch (this.state.adjustments.relativeToPopulation) {
      case true:
        label = 'Deaths / 1M population'
        break;
      case false:
        label = 'Total Deaths'
        break;
      default:
        label = 'Deaths / 1M population'
        break;
    }
    return label;
  }

  populationHandler = (newValue) => {
    window.gtag('event', 'select', {
      event_category: 'Population',
      event_label: newValue
    });
    this.setState({adjustments: {
      ...this.state.adjustments,
      relativeToPopulation: newValue
    }}, this.refreshChart);
  }

  dateAlignmentHandler = e => {
    this.setState({adjustments: {
      ...this.state.adjustments,
      dateAlignmentType: e.target.value
    }}, this.refreshChart);
    window.gtag('event', 'select', {
      event_category: 'Date Alignment',
      event_label: e.target.value
    });
  }

  dateAlignmentDeathOffsetHandler = e => {
    this.setState({adjustments: {
      ...this.state.adjustments,
      dateAlignmentDeathOffset: e.target.value
    }}, this.refreshChart);
    window.gtag('event', 'change', {
      event_category: 'Date Alignment Death Offset',
      event_label: e.target.value
    });
  }

  dateAlignmentCaseOffsetHandler = e => {
    this.setState({adjustments: {
      ...this.state.adjustments,
      dateAlignmentCaseOffset: e.target.value
    }}, this.refreshChart);
    window.gtag('event', 'change', {
      event_category: 'Date Alignment Case Offset',
      event_label: e.target.value
    });
  }

  refreshChart = () => {
    this.setState({
      chartData: this.makeChartData(), 
      xAxisTitle: this.getXAxisTitle(),
      yAxisTitle: this.getYAxisTitle()
    });
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
        <Chart data={this.state.chartData} xAxisTitle={this.state.xAxisTitle} yAxisTitle={this.state.yAxisTitle} 
          xAxisType={this.state.adjustments.dateAlignmentType==='exact' ? 'datetime' : 'numeric'} />
        <ControlsBox>
          <CountrySelector countries={this.state.countries} onCountrySelect={this.countryCheckedHandler}/>
        </ControlsBox>
        <ControlsBox>
          <PopulationSelector relative={this.state.adjustments.relativeToPopulation} onSelect={this.populationHandler} />
        </ControlsBox>
        <ControlsBox>
          <DateSelector dateAlignment={this.state.adjustments.dateAlignmentType} 
                        onDateAlignmentTypeChange={this.dateAlignmentHandler}
                        dateAlignmentDeathOffset={this.state.adjustments.dateAlignmentDeathOffset}
                        dateAlignmentCaseOffset={this.state.adjustments.dateAlignmentCaseOffset}
                        onDateAlignmentDeathOffsestChange={this.dateAlignmentDeathOffsetHandler}
                        onDateAlignmentCaseOffsestChange={this.dateAlignmentCaseOffsetHandler} />
        </ControlsBox>
      </React.Fragment>
    );
  }
}

export default ChartDisplay;
