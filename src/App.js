import React from 'react';
import './App.css';

import Header from './components/Header/Header';
import ChartDisplay from './containers/ChartDisplay/ChartDisplay';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <ChartDisplay />
      </main>
    </div>
  );
}

export default App;
