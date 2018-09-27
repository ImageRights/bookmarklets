// Find a single element matching a query, or multiple if they all
// have the same target attribute value
'use strict'
const MultiError = require('../util/MultiError')
module.exports = function (query, attr) {
  const result = document.querySelectorAll(query)
  if (result.length === 0) {
    return null
  }
  const val = result[0].getAttribute(attr)
  for (let i = 1; i < result.length; i += 1) {
    if (result[i].getAttribute(attr) !== val) {
      throw new MultiError(null, 'query', query)
    }
  }
  return val
}
