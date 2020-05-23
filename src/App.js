import React, { Component } from 'react';
import classes from './App.modules.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Layout from './hoc/Layout/Layout';

import ChartDisplay from './containers/ChartDisplay/ChartDisplay';


class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={ChartDisplay} />
        <Redirect to="/" />
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
