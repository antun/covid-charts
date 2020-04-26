const axios = require('axios').default;
var fs = require('fs');
var csv2json = require('csv2json');


const timeSeriesGlobalDeathsUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const timeSeriesUsDeathsUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv';
const timeSeriesConfirmedGlobalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const timeSeriesConfirmedUsUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv';
const countryLookupTableURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv';

const downloadDir = './download';

if (!fs.existsSync(downloadDir)){
  fs.mkdirSync(downloadDir);
}

const downloadCsvAndConvertToJson = (href, filename) => {
  axios.get(href)
    .then(function (response) {
      const rawOutputFile = downloadDir + '/' + filename + '.csv';
      const jsonOutputFile = './src/data/' + filename + '.json';
      fs.writeFileSync(rawOutputFile, response.data);
      fs.createReadStream(rawOutputFile)
      .pipe(csv2json())
      .pipe(fs.createWriteStream(jsonOutputFile));
    })
    .catch(function (error) {
      // handle error
      console.log('Error retrieving COVID-19 data from', href,  error);
    });
};

downloadCsvAndConvertToJson(timeSeriesGlobalDeathsUrl, 'time_series_covid19_deaths_global');
downloadCsvAndConvertToJson(timeSeriesUsDeathsUrl, 'time_series_covid19_deaths_US');
downloadCsvAndConvertToJson(timeSeriesConfirmedGlobalUrl, 'time_series_covid19_confirmed_global');
downloadCsvAndConvertToJson(timeSeriesConfirmedUsUrl, 'time_series_covid19_confirmed_US');
downloadCsvAndConvertToJson(countryLookupTableURL, 'UID_ISO_FIPS_LookUp_Table');
