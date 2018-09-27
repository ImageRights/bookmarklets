;(() => {
  'use strict'
  // --- GENERAL UTILITIES
  class MultiError extends Error {
    constructor (msg, ...args) {
      super(msg || new.target.defaultMessage)
      if (args.length) {
        this[args[0]] = args[1]
      }
    }
    static get defaultMessage () {
      return 'Multiple possible dates found.'
    }
  }
  const DATES = (() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ]
    const reMonths = months.map(m => {
      return m.length === 3 ? m : `${m.slice(0, 3)}(?:${m.slice(3)})?`
    }).join('|')
    const regex = {
      year: '\\b((?:19|20)\\d\\d)\\b',
      date_short: '\\b([12]?\\d|3[01])\\b',
      date_long: '\\b([0-2]\\d|3[01])\\b',
      date: '\\b([0-2]?\\d|3[01])\\b',
      month_num_short: '\\b(\\d|1[0-2])\\b',
      month_num_long: '\\b(0\\d|1[0-2])\\b',
      month_num: '\\b(0?\\d|1[0-2])\\b',
      month_str: `\\b(${reMonths})\\b`,
      month_any: `\\0?\\d|1[0-2]|b(${reMonths})\\b`
    }
    return {months, regex}
  })()
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
    const months = DATES.months
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
        if (e instanceof MultiError) {
          window.alert(MultiError.defaultMessage)
          throw e
        }
        console.error(e)
      }
    }
    return null
  }
  function singleMatch (re, str) {
    if (typeof re === 'string') {
      re = new RegExp(re, 'g')
    } else if (!re.global) {
      re = new RegExp(re.source, re.flags + 'g')
    }
    const match = str.match(re)
    if (!match) {
      return null
    } else if (match.length > 1) {
      throw new MultiError(null, 'regex', re)
    } else {
      return str.match(new RegExp(re.source, re.flags.replace(/g/, '')))
    }
  }
  // --- SEARCH FUNCTIONS
  function find (query, attr) {
    // Find a single element matching a query, or multiple if they all
    // have the same target attribute value
    return function () {
      const result = document.querySelectorAll(query)
      if (result.length === 0) {
        return null
      }
      const val = result[0].getAttribute(attr)
      for (let i = 1; i < result.length; i += 1) {
        if (result[i].getAttribute(attr) !== val) {
          throw new MultiError(null, 'query', query)
        }
      }
      return val
    }
  }
  function ldJson () {
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
  function text (str = document.body.textContent) {
    const Y = DATES.regex.year
    const M = DATES.regex.month_str
    const D = DATES.regex.date
    const sep = '\\W+?'
    const mdy = M + sep + D + sep + Y
    const dmy = D + sep + M + sep + Y
    const match = singleMatch(mdy, str) || singleMatch(dmy, str)
    return match ? match[0] : null
  }
  function url (href = location.href) {
    // Searches for dates in URL
    const Y = DATES.regex.year
    const M = DATES.regex.month_num_long
    const D = DATES.regex.date_long
    const sep = '\\W'
    const match = singleMatch(Y + sep + M + sep + D, href)
    if (!match) {
      return null
    }
    const [, y, m, d] = match
    return new Date(y.length === 2 ? '20' + y : y, m - 1, d)
  }
  // --- EXECUTE SCRIPT
  let msg = findDate([
    find('meta[property="article:published_time"]', 'content'),
    find('meta[name=parsely-pub-date]', 'content'),
    find('meta[itemprop=dateCreated]', 'content'),
    find('meta[itemprop=datePublished]', 'content'),
    find('[datetime]', 'datetime'),
    url,
    ldJson
  ])
  let notify = window.alert
  const copyText = '\n(Copied to clipboard)'
  if (msg) {
    if (copyToClipboard(msg)) {
      msg += copyText
      notify = m => (document.title = m)
    }
  } else {
    msg = findDate([text])
    if (msg) {
      const copied = copyToClipboard(msg)
      msg += '\nFound in text - not guaranteed to be correct.'
      if (copied) {
        msg += copyText
      }
    }
  }
  notify(msg || 'Could not find a publication date.')
})()
