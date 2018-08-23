'use strict'
const path = require('path')
const {promisify} = require('util')
const fs = require('fs')
const read = promisify(fs.readFile)
const write = promisify(fs.writeFile)
const bookmarklet = require('bookmarklet')
const SRC_DIR = path.join(__dirname, 'src')
const DEST_DIR = path.join(__dirname, 'dist')

async function bookmarkletify (_source, _dest) {
  const source = getSource(_source)
  const dest = getDestination(_dest, source)
  const file = await read(source, 'utf8')
  const data = bookmarklet.parseFile(file)
  if (data.errors) {
    throw new Error(data.errors.join('\n'))
  }
  const code = bookmarklet.convert(data.code, data.options)
  if (dest) {
    await write(dest, code, 'utf8')
  }
  return code
}

function getSource (src) {
  if (!src) {
    throw new Error('Must provide source file.')
  }
  if (!/\.\w+?$/.test(src)) {
    src += '.js'
  }
  return path.resolve(SRC_DIR, src)
}

function getDestination (dest, src) {
  const filename = path.basename(src)
  if (!dest) {
    return path.join(DEST_DIR, filename)
  }
  dest = path.resolve(DEST_DIR, dest)
  if (dest === SRC_DIR || dest === src) {
    throw new Error('Destination cannot match source.')
  }
  if (/\.\w+?$/.test(dest)) {
    return dest
  }
  return fs.statSync(dest).isDirectory() ? path.join(dest, filename) : dest
}

if (module.parent) {
  // Wrap bookmarkletify in function to allow optional callback or promise
  module.exports = function (src, dest, cb) {
    if (typeof dest === 'function' && typeof cb === 'undefined') {
      cb = dest
      dest = ''
    }
    const bm = bookmarkletify(src, dest)
    return cb ? bm.then(result => cb(null, result), cb) : bm
  }
} else {
  const args = process.argv.slice(2)
  const die = msg => {
    if (msg) {
      console.error(`[ERROR] bmify: ${msg.replace(/^\w*?Error:\s*/, '')}/`)
    }
    process.exit(1)
  }
  // Add version print?
  // Add help print?
  if (args.length > 2) {
    die('Too many arguments.\n\n')
  }
  bookmarkletify(args[0], args[1])
    .then(() => console.log('bmify: Done.'))
    .catch(err => die(err.message || err))
}
