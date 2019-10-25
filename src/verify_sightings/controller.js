function preload (url) {
  function remove () {
    link.removeEventListener('load', remove)
    link.removeEventListener('error', remove)
    link.remove()
  }
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.addEventListener('load', remove, { once: true })
  link.addEventListener('error', remove, { once: true })
  link.href = url
  document.head.appendChild(link)
}

function preloadParallel (arr) {
  return arr.forEach(preload)
}

function preloadSequential (arr) {
  function next () {
    const src = arr.shift()
    if (src) {
      link.href = src
    } else {
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

function clamp (min, mid, max) {
  return Math.max(min, Math.min(mid, max))
}

function filterForUser (user) {
  return `folder:1 type:2 confirmed:0 human_check:6 user_id:${user.id}`
}

function getLoadingIcon () {
  const $elt = $('<div class="hatypeaheadloading">').appendTo(document.body)
  const css = $elt.css('background-image')
  $elt.remove()
  const match = /url\(["']([^)]*?)["']\)/i.exec(css)
  return match && match[1]
}

const injection = ['$scope', '$http', '$q', 'suggestions', 'promiseTracker']
injection.push(function ($scope, $http, $q, suggestions, promiseTracker) {
  $scope.suggestions = { user: suggestions.customer(() => ({})) }
  $scope.loadingTracker = promiseTracker()
  // URL isn't static because of Rails cache busting
  $scope.loading_icon = getLoadingIcon()

  $scope.reset = () => {
    $scope.current = { page: 1, per_page: 15, group: 0, image: 0, attempt: 0 }
  }
  $scope.reset()

  function track (promise) {
    $scope.loadingTracker.addPromise(promise)
    return promise
  }

  async function request (url, opts) {
    const start = new Date()
    return track($http.get(url, opts)
      .then(response => ({ success: true, response }))
      .catch(() => ({ success: false, duration: new Date() - start }))
    )
  }

  async function getSightings (user, page, per) {
    const index = 1 + (page - 1) * per
    const params = {
      filter: filterForUser(user),
      per_page: per,
      page: page
    }
    $scope.current.attempt = 1
    do {
      const result = await request('/api/v1/admin/sightings', { params })
      if (result.success) {
        return result.response
      }
      $scope.current.attempt += 1
      params.per_page = params.per_page / 2 | 0
      params.page = (index / params.per_page | 0) || 1
    } while (params.per_page > 0)
    $scope.current.attempt = -1
    throw new Error('Timed out too many times.')
  }

  function parsePagination (res) {
    const regex = /^current:(\d+?);total:(\d+?);per_page:(\d+?)$/
    const match = regex.exec(res.headers('X-Pagination'))
    return {
      current: match[1],
      total_pages: match[2],
      per_page: match[3]
    }
  }

  async function loadGroup (user, cgid, last) {
    const params = {
      filter: filterForUser(user),
      claim_group_id: cgid,
      last_id: last
    }
    return track($http.get('/api/v1/admin/sightings/get_claim_group', { params }))
  }

  function countVerified (arr) {
    if (Array.isArray(arr)) {
      return arr.reduce((num, val) => num + (val.verified | 0), 0)
    }
    return 0
  }

  function nextOrUnverified (arr, item) {
    const idx = arr.indexOf(item)
    if (idx === -1) {
      return 0
    } else if (idx < arr.length - 1) {
      return 1
    }
    const oidx = arr.findIndex(val => !val.unverified)
    if (oidx === -1) {
      return 0
    }
    return oidx - idx
  }

  $scope.change_image = (n) => {
    const { current } = $scope
    if (!current || !current.user || !$scope.groups || !$scope.groups.length) {
      return
    }
    const group = $scope.groups[current.group]
    if (!group || !group.claims || !group.claims.length) {
      return
    }
    if (n) {
      current.image = clamp(0, (current.image | 0) + n, group.claims.length - 1)
    }
    $scope.claim = group.claims[current.image]
  }

  $scope.change_group = async (n) => {
    const { current } = $scope
    if (!current || !current.user || !$scope.groups || !$scope.groups.length) {
      return
    } else if (n) {
      current.group = clamp(0, (current.group | 0) + n, $scope.groups.length - 1)
    }
    current.image = 0
    $scope.claim = null

    const group = $scope.group = $scope.groups[current.group]
    if (group.claims) {
      group.num_verified = countVerified(group.claims)
      return $scope.change_image(0)
    }
    group.claims = []
    let limit
    do {
      const { length } = group.claims
      const last = length ? group.claims[length - 1].id : undefined
      const res = await loadGroup(current.user, group.id, last)
      const { list } = res.data
      limit = res.data.limit
      if (list && list.length) {
        const isFirstResult = group.claims.length === 0
        group.claims.push(...list)
        preloadSequential(list.map(sgt => sgt.image.thumb))
        preloadParallel(list.map(sgt => sgt.image_url))
        if (isFirstResult) {
          // Display an image as soon as we can, then continue loading the
          // rest in the background
          $scope.change_image(0)
        }
      }
      $scope.$apply() // Have to call $apply() manually after `await`
    } while (limit)
    group.num_verified = countVerified(group.claims)
    $scope.$apply() // May not be necessary
  }

  $scope.change_page = async (n) => {
    const { current } = $scope
    if (!current || !current.user) {
      return
    } else if ($scope.group && $scope.group.num_verified > 0) {
      return $scope.submit_verifications($scope.group)
    } else if (n) {
      current.page = clamp(1, (current.page | 0) + n, current.total_pages || Infinity)
    }

    $scope.groups = $scope.group = $scope.claim = null
    current.group = current.image = 0
    const res = await getSightings(current.user, current.page, current.per_page).catch(() => {})
    if (!res) {
      $scope.$apply()
      return
    }

    Object.assign(current, parsePagination(res))

    $scope.groups = res.data

    $scope.$apply() // Have to call $apply manually after `await`
    $scope.change_group(0)
  }

  $scope.submit_verifications = async (group) => {
    const { good, bad, rest } = group.claims.reduce((obj, claim) => {
      if (claim.verified) {
        const arr = claim.good_match ? obj.good : obj.bad
        arr.push(claim.id)
      } else {
        obj.rest.push(claim)
      }
      return obj
    }, { good: [], bad: [], rest: [] })
    const post = async (arr, good) => {
      if (arr.length) {
        const url = '/api/v1/sightings/admin_claim_verification'
        return track($http.post(url, { claim_ids: arr, good: +good }))
      }
    }
    await Promise.all([post(good, 1), post(bad, 0)])

    const { groups } = $scope
    const idx = groups.indexOf(group)
    if (idx > -1) {
      if (rest.length) {
        // More to verify in this group; update claims
        group.claims = rest
        group.verified = false
        group.num_verified = 0
        $scope.current.image = 0
        $scope.change_image(0)
        $scope.$apply() // Have to call $apply manually after `await`
      } else {
        // Group is fully verified; remove it and load previous group
        groups.splice(idx, 1)
        if (groups.length === 0) {
          // No more groups, load new page (verifying images changes pagination)
          return $scope.change_page(0)
        } else {
          // Load the next group, or previous this was the last one
          return $scope.change_group(nextOrUnverified(groups, group))
        }
      }
    } else {
      // Not sure what's going on -- reset everything except user
      const { user } = $scope.current
      $scope.reset()
      $scope.current.user = user
    }
  }

  $scope.mark_verified = (good) => {
    const { group, claim } = $scope
    claim.good_match = !!good
    if (!claim.verified) {
      claim.verified = true
      group.num_verified = countVerified(group.claims)
      group.verified = group.num_verified === group.claims.length
    }

    if (group.verified || group.num_verified === 100) {
      return $scope.submit_verifications(group)
    } else {
      return $scope.change_image(nextOrUnverified(group.claims, claim))
    }
  }
})
module.exports = injection
