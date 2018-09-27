'use strict'
const stat = require('util').promisify(require('fs').stat)
module.exports = async function (path) {
  try {
    return (await stat(path)).isDirectory()
  } catch (e) {
    return false
  }
}
