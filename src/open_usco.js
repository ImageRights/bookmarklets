;(function (id) {
  'use strict'
  id = getSelection().toString() || prompt('Case #')
  if (!id) {
    return // Nothing entered to open
  }
  id = id.trim()
  const usco = /USCO\W*?(\d+)/i.exec(id)
  if (usco) {
    id = usco[1] + '/text'
  } else {
    const url = /^(\d+?)(\/\w+?)?$/.exec(id)
    if (url) {
      // url == [full match, USCO id, path]
      id = url[1] + (url[2] || '/text')
    } else {
      return alert("That's not a USCO registration number.")
    }
  }
  window.open('https://www.imagerights.com/admin#/usco_registrations/' + id)
})()
