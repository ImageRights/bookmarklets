;(function (id) {
  'use strict'
  id = window.getSelection().toString().trim()
  if (id) {
    if (/\D/.test(id)) {
      return alert('Selected text is not a number.')
    }
  } else {
    id = window.prompt('User #').trim()
  }
  location.href = 'https://www.imagerights.com/admin_impersonation/' + id
}())
