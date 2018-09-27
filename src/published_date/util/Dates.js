// Miscellaneous date definitions
'use strict'
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]
const reMonths = months.map(m => {
  return m.length === 3 ? m : `${m.slice(0, 3)}(?:${m.slice(3)})?`
}).join('|')
const regex = {
  year: '\\b((?:19|20)\\d\\d)\\b',
  date_short: '\\b([12]?\\d|3[01])\\b',
  date_long: '\\b([0-2]\\d|3[01])\\b',
  date: '\\b([0-2]?\\d|3[01])\\b',
  month_num_short: '\\b(\\d|1[0-2])\\b',
  month_num_long: '\\b(0\\d|1[0-2])\\b',
  month_num: '\\b(0?\\d|1[0-2])\\b',
  month_str: `\\b(${reMonths})\\b`,
  month_any: `\\0?\\d|1[0-2]|b(${reMonths})\\b`
}
module.exports = {months, regex}
