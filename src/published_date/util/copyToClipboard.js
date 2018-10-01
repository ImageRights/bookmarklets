// Does as advertised. Returns boolean based on success.
'use strict'
module.exports = async function copyToClipboard (text) {
  try {
    if (!navigator.clipboard) {
      return fallback(text)
    }
    const permission = await navigator.permissions.query({
      name: 'clipboard-write'
    })
    if (permission.state !== 'granted') {
      return fallback(text)
    }
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    return fallback(text)
  }
}

function fallback (text) {
  try {
    const node = document.createElement('textarea')
    const selection = document.getSelection()
    node.textContent = text
    document.body.appendChild(node)
    selection.removeAllRanges()
    node.select()
    const success = document.execCommand('copy')
    selection.removeAllRanges()
    document.body.removeChild(node)
    return success
  } catch (e) {
    return false
  }
}
