module.exports = async img => {
  'use strict'
  const {$http} = require('../injector')
  const search = {filter: img.name, offset: 0}
  let data
  do {
    ;({data} = await $http.post('/api/v1/images_by_filename', search))
    const found = data.list.find(other => img.id === other.id)
    if (found) {
      return found.set
    }
    search.offset += data.list.length
  } while (data.more)
}
