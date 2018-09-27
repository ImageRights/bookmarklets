// Executes each function in an array of functions until one returns a
// truthy value.
'use strict'
const MultiError = require('./MultiError')
const normalizeDate = require('./normalizeDate')
module.exports = function findDate (searchFuncs) {
  for (const fn of searchFuncs) {
    try {
      const date = fn()
      if (date) {
        return normalizeDate(date)
      }
    } catch (e) {
      if (e instanceof MultiError) {
        window.alert(MultiError.defaultMessage)
        throw e
      }
      console.error(e)
    }
  }
  return null
}
