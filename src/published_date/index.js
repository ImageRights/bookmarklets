'use strict'
const findDate = require('./util/findDate')
const copyToClipboard = require('./util/copyToClipboard')
const search = require('./search')
// --- EXECUTE SCRIPT
let msg = findDate([
  () => search.query('meta[property="article:published_time"]', 'content'),
  () => search.query('meta[name=parsely-pub-date]', 'content'),
  () => search.query('meta[itemprop=dateCreated]', 'content'),
  () => search.query('meta[itemprop=datePublished]', 'content'),
  () => search.query('[datetime]', 'datetime'),
  search.url,
  search.ldJson,
  search.ogImageUrl
])
let notify = window.alert
const copyText = '\n(Copied to clipboard)'
if (msg) {
  if (copyToClipboard(msg)) {
    msg += copyText
    notify = m => (document.title = m)
  }
} else {
  msg = findDate([search.text])
  if (msg) {
    const copied = copyToClipboard(msg)
    msg += '\nFound in text - not guaranteed to be correct.'
    if (copied) {
      msg += copyText
    }
  }
}
notify(msg || 'Could not find a publication date.')
