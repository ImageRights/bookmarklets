module.exports = (async () => {
  'use strict'
  const {$state, $http} = require('../injector')
  if ($state.is('image_sets.contents')) {
    if (!$state.params.highlight) {
      return alert('No image chosen to search for.')
    }
    const {params} = $state
    return require('./from_list')(params.highlight, params.image_set_id)
  }
  const findImage = require('./from_other_page')
  if ($state.is('image_name_search')) {
    const {images} = $('.ir-thumbnail-container').scope()
    if (images.more || images.list.length > 1) {
      return alert('Unclear which image to search for.')
    } else if (!images.list.length) {
      return alert('No image found to search for.')
    }
    const img = images.list[0]
    return findImage(img.id, img.set.id)
  } else {
    const filter = (prompt('Enter an image name:') || '').trim()
    if (!filter) {
      return
    }
    const {data} = await $http.post('/api/v1/images_by_filename', {filter})
    if (data.more || data.list.length !== 1) {
      return $state.go('image_name_search', {search_query: filter})
    }
    const img = data.list[0]
    return findImage(img.id, img.set.id)
  }
})()
