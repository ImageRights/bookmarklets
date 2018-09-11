'use strict'
const {promisify} = require('util')
const fs = require('fs')
const readdir = promisify(fs.readdir)
const path = require('path')
const create = require('./create-bmlet')
const DIR = path.resolve(__dirname, '../bmlets')

async function updateBmlets () {
  const outputs = await readdir(DIR, 'utf8')
  await Promise.all(outputs.map(file => {
    if (file === '.' || file === '..') {
      return
    }
    return create(path.basename(file))
  }))
  return true
}

require('../lib/call-or-export')(module, updateBmlets)
