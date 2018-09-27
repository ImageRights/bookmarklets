// Checkes the URL of the og:image metadata for a date
'use strict'
const query = require('./query')
const url = require('./url')
module.exports = function ogImageUrl () {
  const meta = query('meta[property="og:image"]', 'content')
  return meta ? url(meta) : null
}
