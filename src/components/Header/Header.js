import React from 'react';

import classes from './Header.module.css';
console.log('classes', classes);

const header = () => (
  <header className={classes.Header}>
    <h1>COVID-19 Charts</h1>
    <p className={classes.tagline}>Population-relative charts on the novel Coronavirus.</p>
  </header>
);

export default header;
