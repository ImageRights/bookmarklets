// Search in JSON-LD script tags
'use strict'
const MultiError = require('../util/MultiError')
module.exports = function ldJson () {
  const scr = document.querySelectorAll('script[type="application/ld+json"]')
  let date = null
  for (const s of scr) {
    let json
    try {
      json = JSON.parse(s.textContent.trim())
    } catch (e) {
      continue
    }
    let d = json.datePublished || json.dateModified
    if (d) {
      if (date) {
        if (date === d) {
          throw new MultiError()
        }
      } else {
        date = d
      }
    }
  }
  return date
}
