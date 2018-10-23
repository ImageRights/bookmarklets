// Searches for elements with "date" in a class name
'use strict'
const query = require('./query')
const text = require('./text')
module.exports = function () {
  const str = query('[class*=date]:not([class*=validate])', null, 'textContent')
  return str ? text(str) || str : null
}
