module.exports = async (img, set) => {
  'use strict'
  const scope = $('.ir-thumbnail-container').scope()
  const target = +require('../injector').$state.params.highlight
  if (!scope.records.some(rec => +rec.id === target)) {
    // Image is not already visible on page
    scope.pagination.setCurrentPage(await require('../get_page')(img, set))
    scope.$apply()
  }
  scope.do_highlighting()
}
