const moment = require("moment-timezone");

const getStartOfDay = () => {
  return moment().tz("Asia/Kolkata").startOf("day").toDate();
};

const getEndOfDay = () => {
  return moment().tz("Asia/Kolkata").endOf("day").toDate();
};

const getStartOfMonth = () => {
  return moment().tz("Asia/Kolkata").startOf("month").toDate();
};

const isLastDayOfMonth = () => {
  const now = moment().tz("Asia/Kolkata");
  return now.date() === now.daysInMonth();
};

module.exports = {
  getStartOfDay,
  getEndOfDay,
  getStartOfMonth,
  isLastDayOfMonth,
};
