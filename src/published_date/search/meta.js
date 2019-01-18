'use strict'
const query = require('./query')
module.exports = function meta (val, search = 'name', content = 'content') {
  return () => query(`meta[${search}="${val}"]`, content)
}
