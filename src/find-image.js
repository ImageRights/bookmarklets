;(function find (target, container) {
  const elt = container.find(`.buttons-right a[href$="=${target}"]`)
  if (!elt.length) {
    const next = $('li:not(.disabled) > a:contains(Next)')
    if (!next.length) return alert('Could not find target.')
    next.click()
    return setTimeout(find, 250, target, container)
  }
  const thumb = elt.closest('.ir-thumbnail')
  thumb.find('.glyphicon-ok').click()
  thumb[0].scrollIntoView()
})((s => {
  const idx = s.indexOf('?')
  const target = new URLSearchParams(s.slice(idx)).get('highlight')
  if (!target) throw new Error('Cannot search for missing target.')
  return target
})(location.hash), $('.ir-thumbnail-container'))
