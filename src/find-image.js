;(function () {
  const idx = location.hash.indexOf('?')
  const target = new URLSearchParams(location.hash.slice(idx)).get('highlight')
  if (!target) {
    return alert('Cannot search for missing target.')
  }
  let delay = prompt('Enter a delay in milliseconds:', 500)
  if (!delay) {
    return
  }
  delay |= 0
  if (!delay) {
    return alert('Invalid delay.')
  }
  const container = $('.ir-thumbnail-container')
  return (function find () {
    const elt = container.find(`.buttons-right a[href$="=${target}"]`)
    if (elt.length) {
      const thumb = elt.closest('.ir-thumbnail')
      thumb.find('.glyphicon-ok').click()
      return thumb[0].scrollIntoView()
    }
    const next = $('li:not(.disabled) > a:contains(Next)')
    if (!next.length) {
      return alert('Could not find target.')
    }
    next.click()
    return setTimeout(find, delay, target, container, delay)
  })()
})()
