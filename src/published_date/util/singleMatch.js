// Checks if a string matches against a pattern exactly once
'use strict'
const MultiError = require('./MultiError')
module.exports = function singleMatch (re, str) {
  if (typeof re === 'string') {
    re = new RegExp(re, 'g')
  } else if (!re.global) {
    re = new RegExp(re.source, re.flags + 'g')
  }
  const match = str.match(re)
  if (!match) {
    return null
  } else if (match.length > 1) {
    throw new MultiError(null, 'regex', re)
  } else {
    return str.match(new RegExp(re.source, re.flags.replace(/g/, '')))
  }
}
