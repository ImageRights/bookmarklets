// Checks if a string matches against a pattern exactly once
'use strict'
const MultiError = require('./MultiError')
module.exports = function singleMatch (re, str) {
  if (typeof re === 'string') {
    re = new RegExp(re, 'g')
  } else if (!re.global) {
    re = new RegExp(re.source, re.flags + 'g')
  }
  const match = re.exec(str)
  if (!match) {
    return null
  } else if (re.exec(str)) {
    throw new MultiError(null, 'regex', re)
  } else {
    return match
  }
}
