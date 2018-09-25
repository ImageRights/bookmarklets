;(() => {
  'use strict'
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
  const uglify = 'https://skalman.github.io/UglifyJS-online/'
  if (location.href !== uglify) {
    return open(uglify, '_blank')
  }
  const minified = document.getElementById('out').value.replace(/;$/, '')
  const url = 'javascript:' + encodeURIComponent(minified)
  alert(copyToClipboard(url) ? 'Copied to clipboard.' : url)
})()
