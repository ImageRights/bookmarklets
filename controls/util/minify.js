// Read a file and minify its contents
'use strict'
const { minify: uglify } = require('uglify-es')
const read = require('util').promisify(require('fs').readFile)
module.exports = async function (input) {
  const source = await read(require.resolve(input), 'utf8')
  const minified = uglify(source)
  if (minified.error) {
    throw minified.error
  }
  return minified.code
}
