'use strict'
const bmlet = require('./create-bmlet')
const minify = require('./minify-src')

async function createNew (name) {
  await minify(name)
  await bmlet(name)
  return true
}

require('../lib/call-or-export')(module, createNew)
