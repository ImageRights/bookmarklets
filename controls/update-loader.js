'use strict'
const bookmarklet = require('../lib/bookmarklet')
const {promisify} = require('util')
const fs = require('fs')
const read = promisify(fs.readFile)
const write = promisify(fs.writeFile)
const path = require('path')
const INPUT_FILE = path.resolve(__dirname, '../loader/loader.js')
const OUTPUT_FILE = path.resolve(__dirname, '../loader/loader.url')

async function updateTemplate () {
  const source = await read(INPUT_FILE, 'utf8')
  const data = bookmarklet.parseFile(source)
  if (data.errors) {
    throw new Error(data.errors.join('\n'))
  }
  const code = bookmarklet.convert(data.code, data.options)
  await write(OUTPUT_FILE, code, 'utf8')
  return true
}

require('../lib/call-or-export')(module, updateTemplate)
