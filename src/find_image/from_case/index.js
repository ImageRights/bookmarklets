module.exports = (async () => {
  'use strict'
  const scope = $('[ng-controller="CaseAssessmentDetailCtrl"]').scope()
  if (!(scope && scope.case && scope.case.customer && scope.case.customer.id)) {
    throw new Error('Could not determine customer ID.')
  }
  const img = await require('./chosen_image')
  if (!img) {
    return // No image selected (or an error that's been ignored)
  }
  const {$http} = require('../injector')
  // Impersonate user
  await $http.get(`/admin_impersonation/${scope.case.customer.id}`)
  // Search for image by name to find the image set
  const set = await require('./get_image_set')(img)
  if (!set) {
    return window.alert('Could not find the image set?!')
  }
  const page = await require('../get_page')(img.id, set.id)
  open(`/private#/images/${set.id}?highlight=${img.id}&ip=${page}`, '_blank')
})()
  .catch(err => {
    console.error(err)
    // If something goes wrong, make sure we're not stuck in impersonation
    return fetch('/admin_impersonation/0', {credentials: 'include'})
  })
