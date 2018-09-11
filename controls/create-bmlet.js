'use strict'
const {promisify} = require('util')
const fs = require('fs')
const write = promisify(fs.writeFile)
const path = require('path')
const TEMPLATE_PATH = path.resolve(__dirname, '../loader/loader.url')
const TEMPLATE = fs.readFileSync(TEMPLATE_PATH, 'utf8')
const OUTPUT_DIR = path.resolve(__dirname, '../bmlets')

async function create (name) {
  const output = TEMPLATE.replace(/__ID__/g, name)
  const file = path.join(OUTPUT_DIR, name + '.url')
  await write(file, output, 'utf8')
  return true
}

require('../lib/call-or-export')(module, create)
