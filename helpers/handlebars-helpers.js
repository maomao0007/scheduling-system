const dayjs = require('dayjs'); 
module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  },
  json: function (context) {
    return JSON.stringify(context);
  },
  add: function (a, b) {
    return a + b;
  },
  lookup: function (obj, field) {
    return obj[field];
  },
  formatDate: function (date) {
    return new Date(date).toLocaleDateString('en-SG', {
      // weekday: "long",
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },
  relativeTimeFromNow: (a) => dayjs(a).fromNow(),
  
  subtract: function (a, b) {
    return a - b;
  },
};
