'use strict'
module.exports = function (m, fn) {
  if (fn) {
    m.exports = fn
  }
  return m.parent ? fn : fn(...process.argv.slice(2))
}
