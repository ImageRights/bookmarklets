// An error that indicates multiple possible dates have been found
'use strict'
class MultiError extends Error {
  constructor (msg, prop, val) {
    super(msg || new.target.defaultMessage)
    if (prop) {
      if (typeof prop === 'string') {
        this[prop] = val
      } else if (typeof prop === 'object') {
        Object.assign(this, prop)
      } else {
        throw new TypeError('Unexpected value as MultiError property name.')
      }
    }
  }
}
MultiError.defaultMessage = 'Multiple possible dates found.'
module.exports = MultiError
