'use strict'
const bundle = require('./util/bundle')
const isDir = require('./util/is_directory')
const {promisify} = require('util')
const fs = require('fs')
const write = promisify(fs.writeFile)
const path = require('path')

function parse (PARSER_FILE, IN_DIR, OUT_DIR, OUT_EXT, ...names) {
  const parser = require('./util/' + PARSER_FILE)
  return Promise.all(names.map(async function (name) {
    const input = path.resolve(IN_DIR, name)
    const output = path.resolve(OUT_DIR, name + OUT_EXT)
    let code
    if (await isDir(input)) {
      const bundled = await bundle(input, OUT_DIR, OUT_EXT)
      if (bundled !== output) {
        throw new Error('Parcel bundled to unexpected location.')
      }
      code = await parser(output)
    } else {
      code = await parser(input + '.js')
    }
    await write(output, await code, 'utf8')
    return true
  }))
}

require('./util/call_or_export')(module, parse)
