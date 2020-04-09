import React from 'react';

const footer = () => (
  <footer className="App-footer">
    <div>
      <a className="App-link" href="https://github.com/antun/covid-charts">covid-charts</a> v{process.env.REACT_APP_VERSION}
    </div>
  </footer>
);

export default footer;
