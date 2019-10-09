function preload (arr) {
  function next () {
    link.src = arr.shift()
    if (!link.src) {
      link.removeEventListener('load', next)
      link.removeEventListener('error', next)
      link.remove()
    }
  }
  arr = Array.from(arr) // Clone array so we don't modify the original
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.addEventListener('load', next)
  link.addEventListener('error', next)
  document.head.appendChild(link)
  next()
}

const ctrl = ['$scope', '$http', 'suggestions', 'promiseTracker']
ctrl.push(($scope, $http, suggestions, promiseTracker) => {
  $scope.suggestions = { user: suggestions.customer(() => ({})) }
  $scope.loadingTracker = promiseTracker()
  // URL isn't static because of Rails cache busting
  $scope.loading_icon = angular.element('.loading-indicator img[src], .popup-loading-indicator[src]').attr('src')
  $scope.loading_icon = $scope.loading_icon || angular.element('img[src*="/assets/spinner-"][src$=".gif"]').attr('src')
  $scope.current = { page: 1, group: 1, image: 1, per_page: 15, total_pages: 0 }
  $scope.active = {}
  $scope.image = {}
  $scope.toggles = {}

  $scope.style_width = num => (num || 0).toString().length + 'em'

  $scope.toggle_input = prop => {
    $scope.toggles[prop] ^= 1
  }

  $scope.keyup = (evt, fn) => {
    if (evt.which === 13) {
      // Enter
      return fn(0)
    } else if (evt.which === 27) {
      // Escape
      $scope.toggles = {}
    }
  }

  async function request (url, opts) {
    const start = new Date()
    return $http.get(url, opts)
      .then(response => ({ success: true, response }))
      .catch(() => ({ success: false, duration: new Date() - start }))
  }

  async function getSightings (uid, index) {
    const params = {
      filter: `user_id:${uid} folder:1 type:2 confirmed:0 human_check:6`,
      per_page: 15,
      page: index / 15 | 0
    }
    $scope.attempt = 1
    do {
      const result = await request('/api/v1/sightings', { params })
      if (result.success) {
        return result.response
      }
      $scope.attempt += 1
      params.per_page = params.per_page / 2 | 0
      params.page = (index / params.per_page | 0) || 1
    } while (params.per_page > 0)
    throw new Error('Timed out too many times.')
  }

  function parsePagination (res) {
    const regex = /^current:(\d+?);total:(\d+?);per_page:(\d+?)$/
    const match = regex.exec(res.headers('X-Pagination'))
    return match && match.reduce((obj, str) => {
      const [key, val] = str.split(':')
      obj[key] = +val
    }, {})
  }

  $scope.change_page = async n => {
    if (!$scope.current || !$scope.current.user) {
      return
    } else if (n) {
      $scope.current.page = ($scope.current.page | 0) + n
    }
    $scope.toggles = {}
    $scope.groups = null
    const res = await getSightings($scope.current.user.id)
  }

  $scope.change_group = n => {
    if (!$scope.groups || !$scope.groups.length) {
      return
    } else if (n) {
      $scope.current.group = ($scope.current.group | 0) + n
    }
    $scope.toggles = {}
    let idx = ($scope.current.group | 0) - 1
    if (idx >= $scope.groups.length - 1) {
      idx = $scope.groups.length - 1
    } else if (idx < 0) {
      idx = 0
    }
    // TODO: $scope.groups does not have image data -- need to call get_claim_group
    $scope.active.group = $scope.groups[idx]
    preload($scope.active.group)
    $scope.current.image = 1
    $scope.change_image()
  }

  $scope.change_image = n => {
    if (n) {
      $scope.current.image = ($scope.current.image | 0) + n
    }
    $scope.toggles = {}
  }

  $scope.save_status = () => {
    $scope.toggles = {}
  }
})

module.exports = ctrl
