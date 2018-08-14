;(function (id) {
  'use strict'
  id = window.getSelection().toString().trim()
  if (id) {
    if (/\D/.test(id)) {
      return alert('Selected text is not a case number.')
    }
    id += '/claims'
  } else {
    id = window.prompt('Case #').trim()
    if (!/\D/.test(id)) {
      id += '/claims'
    }
  }
  window.open('https://www.imagerights.com/admin#/cases/' + id)
})()
