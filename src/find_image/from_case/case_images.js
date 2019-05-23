module.exports = (async () => {
  'use strict'
  const transformImageList = ({name, image_id: id}) => ({name, id})
  const transformClaimsList = ({image: {name, id}}) => ({name, id})
  const hasList = s => s && s.case_images && Array.isArray(s.case_images)
  // Check each scope to see if either already has an image list loaded
  const imageScope = $('[ng-controller="CaseImageListAdminCtrl"]').scope()
  if (hasList(imageScope)) {
    return imageScope.case_images.map(transformImageList)
  }
  const claimsScope = $('[ng-controller="CaseClaimsListAdminCtrl"]').scope()
  if (hasList(claimsScope)) {
    return claimsScope.case_images.map(transformClaimsList)
  }
  // If we don't have either scope available, load from the API
  const {$http} = require('../injector')
  const scope = $('[ng-controller="CaseAssessmentDetailCtrl"]').scope()
  if (!scope || !scope.case || !scope.case.id) {
    throw new Error('Could not determine case ID.')
  }
  const url = `/api/v1/admin/case_image_table?case_id=${scope.case.id}`
  const res = await $http.get(url)
  return res.data.map(transformImageList)
})()
