;(() => {
  const delay = (d, v) => new Promise(resolve => setTimeout(resolve, d, v))
  async function next () {
    // Toggle All
    const all = angular.element('.glyphicon-chevron-right[ng-click^=toggle_expand_all]')
    if (all.length) {
      all.triggerHandler('click')
      await delay(200)
    }
    // Toggle Row
    const row = angular.element('.ha-sighting-header').first().find('.glyphicon-chevron-right')
    if (row.length) {
      row.triggerHandler('click')
      await delay(100)
    }
    const check = angular.element('.ha-sighting-row').first().find('input[type=checkbox]')
    if (!check.prop('checked')) {
      check.trigger('click') // triggerHandler doesn't work
    }
  }
  next()
  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const btn = e.key === 'ArrowLeft' ? '.btn-danger' : '.btn-success'
      angular.element(btn).triggerHandler('click')
      setTimeout(next, 500)
    }
  })
})()
