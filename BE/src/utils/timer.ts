export const checkTimerAuthenticator = (time: Date): boolean => {
  const isCheked = new Date(time).getTime() < new Date().getTime() - 3600000;
  return isCheked;
};

export const formatYearMonthDate = (date: Date) => {
  const toDay = new Date(date);
  let month = '' + (toDay.getMonth() + 1);
  let day = '' + toDay.getDate();
  let year = '' + toDay.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};
