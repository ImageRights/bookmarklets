;(() => {
  'use strict'
  // --- GENERAL UTILITIES
  function copyToClipboard (text) {
    // Does as advertised. Returns boolean based on success
    try {
      const node = document.createElement('textarea')
      const selection = document.getSelection()
      node.textContent = text
      document.body.appendChild(node)
      selection.removeAllRanges()
      node.select()
      document.execCommand('copy')
      selection.removeAllRanges()
      document.body.removeChild(node)
      return true
    } catch (e) {
      return false
    }
  }
  function normalizeDate (input) {
    // Normalize to the ImageRights case input format if possible
    if (isNaN(Date.parse(input))) {
      return input
    }
    const date = new Date(input)
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ]
    return [
      (d => d < 10 ? '0' + d : d)(date.getDate()),
      months[date.getMonth()],
      date.getFullYear()
    ].join(' ')
  }
  function findDate (searchFuncs) {
    // Executes each function in an array of functions until one returns a
    // truthy value.
    for (const fn of searchFuncs) {
      try {
        const date = fn()
        if (date) {
          return normalizeDate(date)
        }
      } catch (e) {
        console.error(e)
      }
    }
    return null
  }
  function querySelectorUnique (query) {
    const result = document.querySelectorAll(query)
    if (result.length === 0) {
      return null
    } else if (result.length === 1) {
      return result[0]
    } else {
      const err = new Error('Multiple query results found.')
      err.query = query
      throw err
    }
  }
  // --- SEARCH FUNCTIONS
  function find (query, attr) {
    return function () {
      const elt = querySelectorUnique(query)
      return elt && elt.getAttribute(attr)
    }
  }
  // --- EXECUTE SCRIPT
  let msg = findDate([
    find('meta[property="article:published_time"]', 'content'),
    find('meta[name=parsely-pub-date]', 'content'),
    find('meta[itemprop=dateCreated]', 'content'),
    find('meta[itemprop=datePublished]', 'content'),
    find('[datetime]', 'datetime')
  ])
  if (msg) {
    if (copyToClipboard(msg)) {
      msg += '\n(Copied to clipboard)'
      document.title = msg
    } else {
      window.alert(msg)
    }
  } else {
    window.alert('Could not find a publication date.')
  }
})()
