import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.module.css';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link='/software/sites/covid-charts'>Charts</NavigationItem>
    <NavigationItem link='/software/sites/covid-charts/about'>About</NavigationItem>
  </ul>
);

export default navigationItems;
