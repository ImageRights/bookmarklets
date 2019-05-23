// Open a modal that lets you choose from the available case images.
// Skips the modal for cases with only one image.
module.exports = (async () => {
  'use strict'
  const images = await require('./case_images')
  return images.length === 1 ? images[0] : require('../injector')
    .get('$modal')
    .open({
      // package.json scripts require file path to be relative to project root
      template: require('fs').readFileSync('./src/find_image/from_case/modal.html', 'utf8'),
      resolve: {case_images: () => images},
      controller: ['$scope', 'case_images', function ($scope, images) {
        Object.assign($scope, {
          data: {images},
          cancel: $scope.$dismiss,
          success (result = this.data.selection) {
            return this.$close(result)
          }
        })
      }]
    })
    .result
    .catch(() => {})
})()
