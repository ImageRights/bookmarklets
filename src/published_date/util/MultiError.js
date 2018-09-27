// An error that indicates multiple possible dates have been found
'use strict'
class MultiError extends Error {
  constructor (msg, ...args) {
    super(msg || new.target.defaultMessage)
    if (args.length) {
      this[args[0]] = args[1]
    }
  }
}
MultiError.defaultMessage = 'Multiple possible dates found.'
module.exports = MultiError
