const axios = require('axios').default;
var fs = require('fs');
var csv2json = require('csv2json');


const timeSeriesDeathsUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const timeSeriesConfirmedCasesURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const countryLookupTableURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv';

const downloadDir = './download';

if (!fs.existsSync(downloadDir)){
  fs.mkdirSync(downloadDir);
}

axios.get(timeSeriesDeathsUrl)
  .then(function (response) {
    const rawOutputFile = downloadDir + '/' + 'time_series_covid19_deaths_global.csv';
    const jsonOutputFile = './src/data/' + 'time_series_covid19_deaths_global.json';
    fs.writeFileSync(rawOutputFile, response.data);
    fs.createReadStream(rawOutputFile)
    .pipe(csv2json())
    .pipe(fs.createWriteStream(jsonOutputFile));
  })
  .catch(function (error) {
    // handle error
    console.log('Error retrieving COVID-19 data from', timeSeriesDeathsUrl,  error);
  });

axios.get(timeSeriesConfirmedCasesURL)
  .then(function (response) {
    const rawOutputFile = downloadDir + '/' + 'time_series_covid19_confirmed_global.csv';
    const jsonOutputFile = './src/data/' + 'time_series_covid19_confirmed_global.json';
    fs.writeFileSync(rawOutputFile, response.data);
    fs.createReadStream(rawOutputFile)
    .pipe(csv2json())
    .pipe(fs.createWriteStream(jsonOutputFile));
  })
  .catch(function (error) {
    // handle error
    console.log('Error retrieving COVID-19 data from', timeSeriesConfirmedCasesURL,  error);
  });

axios.get(countryLookupTableURL)
  .then(function (response) {
    const rawOutputFile = downloadDir + '/' + 'UID_ISO_FIPS_LookUp_Table.csv';
    const jsonOutputFile = './src/data/' + 'UID_ISO_FIPS_LookUp_Table.json';
    fs.writeFileSync(rawOutputFile, response.data);
    fs.createReadStream(rawOutputFile)
    .pipe(csv2json())
    .pipe(fs.createWriteStream(jsonOutputFile));
  })
  .catch(function (error) {
    // handle error
    console.log('Error retrieving country data from', countryLookupTableURL,  error);
  });

