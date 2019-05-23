module.exports = async (tgt, set) => {
  'use strict'
  const {$http} = require('./injector')
  const url = `/api/v1/image_set/${set}/images`
  const params = {
    per_page: 18,
    columns: 'id',
    page: 1
  }
  const regex = /^current:(\d+?);total:(\d+?);per_page:\d+?/
  let current, total
  do {
    const res = await $http.get(url, {params})
    const found = res.data.find(img => +img.id === +tgt)
    if (found) {
      return params.page
    }
    ;([, current, total] = res.headers('x-pagination').match(regex))
    params.page += 1
  } while (+current < +total)
  throw new Error('Could not find image?!')
}
