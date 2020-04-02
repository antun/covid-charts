const axios = require('axios').default;
var fs = require('fs');
var csv2json = require('csv2json');


const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const downloadDir = './download';

if (!fs.existsSync(downloadDir)){
  fs.mkdirSync(downloadDir);
}

axios.get(url)
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
    console.log('Error retrieving COVID-19 data from', url,  error);
  });
