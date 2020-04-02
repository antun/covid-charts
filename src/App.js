import React from 'react';
import classes from './App.modules.css';

import Header from './components/Header/Header';
import ChartDisplay from './containers/ChartDisplay/ChartDisplay';

function App() {
  return (
    <div className={classes.App}>
      <Header />
      <main>
        <ChartDisplay />
      </main>
    </div>
  );
}

export default App;
