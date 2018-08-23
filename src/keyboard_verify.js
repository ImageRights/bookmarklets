;(() => {
  const delay = (d, v) => new Promise(resolve => setTimeout(resolve, d, v))
  async function next (tried) {
    try {
      // Toggle All
      const all = angular.element('.glyphicon-chevron-right[ng-click^=toggle_expand_all]')
      if (all.length) {
        const $scope = all.scope()
        $scope.toggle_expand_all()
        $scope.$apply()
        await delay(500)
      }
      // Toggle Row
      const row = angular.element('.ha-sighting-header').first().find('.glyphicon-chevron-right')
      if (row.length) {
        const $scope = row.scope()
        $scope.toggle_expand($scope.claim_group)
        $scope.$apply()
        await delay(150)
      }
      const check = angular.element('.ha-sighting-row').first().find('input[type=checkbox]')
      if (!check.prop('checked')) {
        const $scope = check.scope()
        $scope.sight.select = true
        $scope.apply_select($scope.claim_group)
        $scope.$apply()
      }
    } catch (err) {
      if (tried) {
        throw err
      } else {
        return setTimeout(next, 150, true)
      }
    }
  }
  next()
  document.addEventListener('keyup', ($scope => e => {
    const click = bool => {
      if ($scope.selected_group) {
        $scope.admin_verify_claims($scope.selected_group, false)
        $scope.$apply()
        setTimeout(next, 500)
      } else {
        setTimeout(next, 0)
      }
    }
    if (e.key === 'ArrowLeft') {
      click(false)
    } else if (e.key === 'ArrowRight') {
      click(true)
    }
    // else ignore event
  })(angular.element('.btn-success').scope()))
})()
