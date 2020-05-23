import React, { Component } from 'react';
import classes from './App.modules.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import About from './containers/About/About';
import ChartDisplay from './containers/ChartDisplay/ChartDisplay';


class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/software/sites/covid-charts/about" component={About} />
        <Route path="/software/sites/covid-charts/" component={ChartDisplay} />
        <Redirect to="/software/sites/covid-charts/" />
      </Switch>
    );
    return (
      <div className={classes.App}>
        <Layout>
          { routes }
        </Layout>
      </div>
    );
  }
}

export default withRouter(App);
