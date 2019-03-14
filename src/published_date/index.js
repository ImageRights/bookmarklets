'use strict'
if (!window._babelPolyfill) {
  // Throws an error if run twice on the same page
  require('babel-polyfill')
}
const findDate = require('./util/findDate')
const copyToClipboard = require('./util/copyToClipboard')
const search = require('./search')
const { meta } = search
;(async () => {
  let msg = findDate([
    meta('date'),
    meta('article:published_time', 'property'),
    meta('og:article.published_time'),
    meta('parsely-pub-date'),
    meta('dateCreated', 'itemprop'),
    meta('datePublished', 'itemprop'),
    meta('sailthru.date'),
    meta('dc.date'),
    meta('dcterms.created'),
    meta('dcterms.modified'),
    () => search.query('time.published', 'datetime'),
    () => search.query('[datetime]', 'datetime'),
    search.url,
    search.ldJson,
    search.ogImageUrl,
    search.dateClass
  ])
  let notify = window.alert
  const copyText = '\n(Copied to clipboard)'
  if (msg) {
    if (await copyToClipboard(msg)) {
      msg += copyText
      notify = m => (document.title = m)
    }
  } else {
    msg = findDate([search.text])
    if (msg) {
      const copied = await copyToClipboard(msg)
      msg += '\nFound in text - not guaranteed to be correct.'
      if (copied) {
        msg += copyText
      }
    }
  }
  notify(msg || 'Could not find a publication date.')
})()
