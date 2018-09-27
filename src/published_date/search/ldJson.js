// Search in JSON-LD script tags
'use strict'
const MultiError = require('../util/MultiError')
const singleMatch = require('../util/singleMatch')
module.exports = function ldJson () {
  const scr = document.querySelectorAll('script[type="application/ld+json"]')
  let date = null
  for (const s of scr) {
    let json
    let found
    const text = s.textContent.trim()
    try {
      json = JSON.parse(text)
      found = json.datePublished || json.dateModified
    } catch (e) {
      // Check malformed JSON
      const match = singleMatch(/"datePublished":\s*?"([^"]+?)"/, text) ||
        singleMatch(/"datePublished":\s*?"([^"]+?)"/, text)
      if (match) {
        found = match[1]
      }
    }
    if (found) {
      if (date) {
        if (date === found) {
          throw new MultiError()
        }
      } else {
        date = found
      }
    }
  }
  return date
}
