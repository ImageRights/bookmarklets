;(function (window, id) {
  id = (window.getSelection || document.getSelection || function () {
    return window.selection ? window.selection.createRange().text : ''
  })().toString()
  if (id) {
    id = id.trim()
    if (!id || /\D/.test(id)) {
      return window.alert('Selected text is not a number.')
    }
  } else {
    id = window.prompt('Enter a case number:')
    if (!id) {
      return
    }
    id = id.trim()
    if (!id || /\D/.test(id)) {
      return window.alert('Input is not a number.')
    }
  }
  window.open('https://www.imagerights.com/private#/cases' + id)
})(window)
