;(function () {
  const colors = {
    early: '#dfd',
    active: '#fdd',
    other: '#eee'
  }
  const search = (prompt('Enter a search term:') || '').trim()
  if (!search) {
    return
  }
  for (const {parentNode: elt} of document.querySelectorAll('a.ng-binding small')) {
    if (elt.textContent.includes(search)) {
      const match = elt.querySelector('small').textContent.match(/(\w)(\d)/)
      const W = match[1]
      const D = +match[2]
      if (W === 'C' || (W === 'D' && D < 4)) {
        elt.style.background = colors.early
      } else if (W === 'D') {
        elt.style.background = colors.active
      } else {
        elt.style.background = colors.other
      }
    } else {
      elt.style.background = ''
    }
  }
}())
