import React from 'react';

import NavigationItems from '../NavigationItems/NavigationItems';

import classes from './Header.module.css';

const header = () => (
  <header className={classes.Header}>
      <h1>COVID-19 Charts</h1>
      <p className={classes.tagline}>Population-relative charts on the novel Coronavirus.</p>
    <div className={classes.Nav}>
      <NavigationItems>
      </NavigationItems>
    </div>
  </header>
);

export default header;
