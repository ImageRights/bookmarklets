;(function (id) {
  'use strict'
  id = window.getSelection().toString().trim()
  if (id) {
    if (/\D/.test(id)) {
      return alert('Selected text is not a case number.')
    }
    id += '/text'
  } else {
    id = window.prompt('Case #').trim()
    if (!/\D/.test(id)) {
      id += '/text'
    }
  }
  window.open('https://www.imagerights.com/admin#/usco_registrations/' + id)
})()
