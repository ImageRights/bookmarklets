// Normalizes a date/string to the ImageRights case input format if possible
'use strict'
const DATES = require('./Dates')
module.exports = function normalizeDate (input) {
  if (isNaN(Date.parse(input))) {
    return input
  }
  const date = new Date(input)
  const months = DATES.months
  return [
    (d => d < 10 ? '0' + d : d)(date.getUTCDate()),
    months[date.getUTCMonth()],
    date.getUTCFullYear()
  ].join(' ')
}
