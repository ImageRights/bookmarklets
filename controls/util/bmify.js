// Read a file and bookmarkletify its contents
'use strict'
const bookmarklet = require('../../lib/bookmarklet')
const read = require('util').promisify(require('fs').readFile)
module.exports = async function (input) {
  const source = await read(require.resolve(input), 'utf8')
  const data = bookmarklet.parseFile(source)
  if (data.errors) {
    throw new Error(data.errors.join('\n'))
  }
  return bookmarklet.convert(data.code, data.options)
}
