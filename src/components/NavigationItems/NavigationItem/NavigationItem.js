import React from 'react';

import classes from './NavigationItem.module.css';

import { NavLink } from 'react-router-dom';

const navigationItem = (props) => (
  <li className={classes.NavigationItem}>
      {/* Note we have to pass the activeClassName here because this will pass the CSS modules version */}
    <NavLink to={props.link}
      exact
      activeClassName={classes.active}>{props.children}</NavLink>
  </li>
);

export default navigationItem;
