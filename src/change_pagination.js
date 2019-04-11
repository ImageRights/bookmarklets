;(function () {
  'use strict'
  // Multiple controllers on page - find whichever one has the pagination on it
  var scope = $('[ng-controller]').get().reduce(function (scope, elt) {
    return scope.pagination ? scope : $(elt).scope()
  }, {})
  var pagination = scope.pagination
  var def = pagination.constructor.prototype.itemsPerPage
  var perPage = (prompt('Enter a number of items per page', def) || '').trim()
  if (!perPage) {
    return
  } else if (/\D/.test(perPage)) {
    return alert("That's not a valid number.")
  } else if (+perPage > 100) {
    perPage = 100
  } else {
    perPage = +perPage
  }
  pagination.setItemsPerPage(perPage)
  var firstItemOnPage = 1 + pagination.itemsPerPage * (pagination.currentPage - 1)
  var newPage = Math.ceil(firstItemOnPage / perPage)
  if (newPage === pagination.currentPage) {
    // Need to change page to properly trigger reload
    pagination.setCurrentPage(newPage === 1 ? 2 : 1)
    scope.$apply()
  }
  pagination.setCurrentPage(newPage)
  scope.$apply()
})()
