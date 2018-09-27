// Search in a string of text
'use strict'
const DATES = require('../util/Dates')
const singleMatch = require('../util/singleMatch')
module.exports = function text (str = document.body.textContent) {
  const Y = DATES.regex.year
  const M = DATES.regex.month_str
  const D = DATES.regex.date
  const sep = '\\W+?'
  const mdy = M + sep + D + sep + Y
  const dmy = D + sep + M + sep + Y
  const match = singleMatch(mdy, str) || singleMatch(dmy, str)
  return match ? match[0] : null
}
