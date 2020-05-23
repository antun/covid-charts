import React, { Component } from 'react';

import classes from './About.module.css';

console.log('@@ classes', classes);

class About extends Component {
  render() {
    return (
      <div className={classes.About}>
        <h2>About Covid Charts</h2>
        <p>I created this project to give me the ability to explore data on the COVID-19 pandemic, and to work on my React skills. The charts use the Johns Hopkins University data on cases and deaths, which is <a href="https://github.com/CSSEGISandData/COVID-19">available on GitHub</a>.</p>
        <p>The source for my charts is also <a href="https://github.com/antun/covid-charts">available for checking</a>. You can check how current the data is with the updated date in the footer.</p>
        <p><a href="http://www.antunkarlovac.com">Contact me</a> with any questions or feature requests.</p>
      </div>
    );
  }
}

export default About;
