module.exports = async (img, set) => {
  'use strict'
  await require('../injector').$state.go('image_sets.contents', {
    image_set_id: set,
    highlight: img,
    ip: await require('../get_page')(img, set)
  })
  const scope = $('.ir-thumbnail-container').scope()
  while (scope.loadingTracker.active()) {
    await new Promise(requestAnimationFrame)
  }
  scope.do_highlighting()
}
