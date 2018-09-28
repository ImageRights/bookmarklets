// Find a single element matching a query, or multiple if they all
// have the same target attribute value
'use strict'
const MultiError = require('../util/MultiError')
module.exports = function (query, attr, prop) {
  const get = attr ? elt => elt.getAttribute(attr) : elt => elt[prop]
  const result = document.querySelectorAll(query)
  if (result.length === 0) {
    return null
  }
  const val = get(result[0])
  for (let i = 1; i < result.length; i += 1) {
    if (get(result[i]) !== val) {
      throw new MultiError(null, 'query', query)
    }
  }
  return val
}
