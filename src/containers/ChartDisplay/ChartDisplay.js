import React, { Component } from 'react';

import Chart from '../../components/Chart/Chart/Chart';

import CountrySelector from '../../components/CountrySelector/CountrySelector';

import DataPopSelector from '../../components/DataPopSelector/DataPopSelector';

import DateSelector from '../../components/DateSelector/DateSelector';

import ControlsBox from '../../components/ControlsBox/ControlsBox';

import CovidData from '../../data/CovidData/CovidData';

import * as Utils from '../../utils/utils';

import * as UrlHandling from '../../utils/urlHandling';

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
      dataToShow: 'deaths',
      relativeToPopulation: true,
      dateAlignmentType: 'exact',
      dateAlignmentDeathOffset: 1,
      dateAlignmentCaseOffset: 1
    },
    countries: [

    ],
    chartData: [],
    xAxisTitle: 'Date',
    yAxisTitle: 'Deaths / 1M Population',
    initialLoad: true
  };


  formatDateForChartDisplay = (date) => {
    // This will get converted by the chart
    return date.getUTCFullYear() + '-' + (date.getUTCMonth()+1) + '-' + date.getUTCDate()
  }

  makeRowForChart = (country, province, startDate, endDate) => {
    let row;
    if (this.state.adjustments.dataToShow === 'deaths') {
      row = covidDataInstance.getDeathRowForCountry(country, province);
    } else {
      row = covidDataInstance.getConfirmedRowForCountry(country, province);
    }
    const data = [];
    let currentDate = startDate;
    let factor = 1;
    if (this.state.adjustments.relativeToPopulation) {
      const population = covidDataInstance.getCountryPopulation(country, province)
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
      if (!row.hasOwnProperty(covidDataInstance.formatDate(currentDate))) {
        break;
      }
      const deaths = parseInt(row[covidDataInstance.formatDate(currentDate)]);
      data.push({
        x: xAxisLabel,
        y: deaths * factor
      });
      currentDate = Utils.getNextDate(currentDate);
      day += 1;
    } while (covidDataInstance.formatDate(currentDate) !== covidDataInstance.formatDate(endDate));
    let legendLabel = country;
    if (province !== '') {
      legendLabel += ' ('+province+')';
    }
    const formattedRow = {
      name: legendLabel,
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
      const urlCountries = UrlHandling.getCountriesFromQuerystring(this.props.history.location.search);
      let initialCountries = this.state.initialCountries;
      if (urlCountries && Array.isArray(urlCountries) && urlCountries.length > 0) {
        initialCountries = urlCountries;
      }
      selectedCountries = countryData.filter(country => (
        initialCountries.findIndex(initialCountry => (country.Country_Region === initialCountry.Country_Region && country.Province_State === initialCountry.Province_State)) > -1
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
    const urlCountries = UrlHandling.getCountriesFromQuerystring(this.props.history.location.search);
    let initialCountries = this.state.initialCountries;
    if (urlCountries && Array.isArray(urlCountries) && urlCountries.length > 0) {
      initialCountries = urlCountries;
    }
    const resp = countryData.map(el => (
      {...el, selected: initialCountries.find(initialCountry => (
        el.Country_Region === initialCountry.Country_Region
          && el.Province_State === initialCountry.Province_State
          )
        ) !== undefined}
      )
    );
    return resp;
  };

  getSelectedCountries = () => {
    return this.state.countries.filter(el => el.selected);
  };

  updateUrl = () => {
    const selectedCountries = this.getSelectedCountries();
    const newQueryString = UrlHandling.makeNewQueryString(this.props.history.location.search, selectedCountries, this.state.adjustments);
    this.props.history.push({pathname: this.props.location.pathname, search: '?' + newQueryString});
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

    this.updateUrl();

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
    let label,
      data;
    data = 'Deaths';
    if (this.state.adjustments.dataToShow === 'confirmed') {
      data = 'Confirmed Cases'
    }

    switch (this.state.adjustments.relativeToPopulation) {
      case true:
        label = data + ' / 1M Population'
        break;
      case false:
        label = 'Total ' + data
        break;
      default:
        label = data + ' / 1M Population'
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
  };

  dataToShowHandler = (e) => {
    window.gtag('event', 'select', {
      event_category: 'Data to Show',
      event_label: e.target.value
    });
    this.setState({adjustments: {
      ...this.state.adjustments,
      dataToShow: e.target.value
    }}, this.refreshChart);
  };

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

    this.updateUrl();
  }

  refreshChart = () => {
    this.setState({
      chartData: this.makeChartData(), 
      xAxisTitle: this.getXAxisTitle(),
      yAxisTitle: this.getYAxisTitle()
    });
    // Special case for first load. Don't redirect the user from the standard URL
    if (!this.state.initialLoad) {
      this.updateUrl();
    } else {
      this.setState({
        initialLoad: false
      });
    }
  }
  
  componentDidMount() {
    const initialState = {
      initialCountries: null,
      countries: this.getInitialCountryState(),
      chartData: this.makeChartData() 
    };
    const urlAdjustments = UrlHandling.getAdjustmentsFromQuerystring(this.props.history.location.search);
    if (urlAdjustments) {
      initialState.adjustments = urlAdjustments;
    }
    this.setState(initialState, this.refreshChart);
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
          <DataPopSelector relative={this.state.adjustments.relativeToPopulation}
            onSelect={this.populationHandler}
            dataToShow={this.state.adjustments.dataToShow}
            onDataChanged={this.dataToShowHandler} />
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
