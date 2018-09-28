// Normalizes a date/string to the ImageRights case input format if possible
'use strict'
const DATES = require('./Dates')
const singleMatch = require('../util/singleMatch')
module.exports = function normalizeDate (input) {
  if (isNaN(Date.parse(input))) {
    return input
  }
  if (typeof input === 'string') {
    const re = DATES.regex
    const sep = '.+?'
    const mdy = re.month_num + sep + re.date + sep + re.year
    const dmy = re.date + sep + re.month_num + sep + re.year
    // Digit order is ambiguous
    if (singleMatch(dmy, input) && singleMatch(mdy, input)) {
      return input
    }
  }
  const date = new Date(input)
  return [
    (d => d < 10 ? '0' + d : d)(date.getUTCDate()),
    DATES.months[date.getUTCMonth()],
    date.getUTCFullYear()
  ].join(' ')
}
