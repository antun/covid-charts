import React from 'react';
import preval from 'preval.macro'

const footer = () => {
  const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`
  return (
    <footer className="App-footer">
      <div>
        <a className="App-link" href="https://github.com/antun/covid-charts">covid-charts</a> v{process.env.REACT_APP_VERSION}
        | updated: {dateTimeStamp}
        | by <a className="App-link" href="http://www.antunkarlovac.com/">Antun Karlovac</a>
      </div>
    </footer>
  )
};

export default footer;
