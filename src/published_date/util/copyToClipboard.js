// Does as advertised. Returns boolean based on success.
'use strict'
module.exports = function copyToClipboard (text) {
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
