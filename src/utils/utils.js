const getNextDate = (previousDate) => {
  const nextDate = new Date(previousDate);
  nextDate.setHours(previousDate.getHours() + 24);
  return nextDate;
}

const getOrdinalSuffix = (i) => {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}

const thousandsSeparators = num => {
  let numParts = num.toString().split('.');
  numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return numParts.join('.');
};


export {
  getNextDate,
  getOrdinalSuffix,
  thousandsSeparators
}
