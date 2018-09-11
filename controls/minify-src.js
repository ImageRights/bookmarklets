'use strict'
const uglify = require('uglify-es')
const {promisify} = require('util')
const fs = require('fs')
const read = promisify(fs.readFile)
const write = promisify(fs.writeFile)
const path = require('path')
const INPUT_DIR = path.resolve(__dirname, '../src')
const OUTPUT_DIR = path.resolve(__dirname, '../dist')

async function minify (name) {
  const input = path.join(INPUT_DIR, name + '.js')
  const output = path.join(OUTPUT_DIR, name + '.js')
  const source = await read(input, 'utf8')
  const min = uglify.minify(source)
  if (min.error) {
    throw min.error
  }
  await write(output, min.code, 'utf8')
  return true
}

require('../lib/call-or-export')(module, minify)
