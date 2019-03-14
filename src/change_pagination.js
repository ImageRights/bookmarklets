;(function () {
  'use strict'
  var scope = $('.container').scope()
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
  var firstItemOnPage = 1 + pagination.itemsPerPage * (pagination.currentPage - 1)
  pagination.setItemsPerPage(perPage)
  pagination.setCurrentPage(Math.ceil(firstItemOnPage / perPage))
  scope.$apply()
})()
