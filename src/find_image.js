;(async () => {
  'use strict'
  const search = location.hash.match(/(?:&?)highlight=(\d+)/i)
  if (!search) {
    return alert('No image to search for.')
  }
  const target = +search[1]
  const $elt = $('.ir-thumbnail-container')
  const scope = $elt.scope()
  const $http = $elt.injector().get('$http')
  const url = (scope => {
    const set = scope.image_set.id
    const u = scope.current_user.id
    const pp = scope.pagination.itemsPerPage
    return `/api/v1/image_set/${set}/images?per_page=${pp}&user_id=${u}&page=`
  })(scope)
  let min = 1
  let curr = scope.pagination.currentPage
  let max = scope.pagination.totalPages
  let {records} = scope
  const finish = async cb => {
    scope.pagination.setCurrentPage(curr)
    scope.$apply()
    while (scope.loadingTracker.active()) {
      await new Promise(requestAnimationFrame)
    }
    return cb()
  }
  do {
    const found = records.find(img => img.id === target)
    if (found) {
      return finish(() => scope.do_highlighting())
    } else if (records[0].id > target) {
      max = curr - 1
    } else if (records[records.length - 1].id < target) {
      min = curr + 1
    } else {
      return finish(() => {
        return alert("The target image should be on this page, but it's not...")
      })
    }
    curr = ((min + max) / 2) | 0
    const res = await $http.get(url + curr)
    records = res.data
  } while (min <= max)
})()
