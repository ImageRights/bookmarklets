// Searches for dates in URL
'use strict'
const DATES = require('../util/Dates')
const singleMatch = require('../util/singleMatch')
module.exports = function url (href = location.href) {
  const Y = DATES.regex.year
  const M = DATES.regex.month_num_long
  const D = DATES.regex.date_long
  const sep = '\\W'
  const match = singleMatch(Y + sep + M + sep + D, href)
  if (!match) {
    return null
  }
  const [, y, m, d] = match
  return new Date(y.length === 2 ? '20' + y : y, m - 1, d)
}
