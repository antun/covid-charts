const getNextDate = (previousDate) => {
  const nextDate = new Date(previousDate);
  nextDate.setHours(previousDate.getHours() + 24);
  return nextDate;
}

export {
  getNextDate
}
