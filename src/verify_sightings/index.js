;((invokable, selector, template) => {
  'use strict'
  if (location.hostname + location.pathname !== 'www.imagerights.com/admin') {
    location.href = 'https://www.imagerights.com/admin'
    return
  }
  if (!window._babelPolyfill) {
    // Throws an error if run twice on the same page
    require('@babel/polyfill')
  }
  let injectScope
  if (typeof invokable === 'function') {
    invokable = ['$compile', invokable]
  } else {
    invokable = Array.from(invokable)
    // Make sure $compile is always first
    const compile = '$compile'
    const cidx = invokable.indexOf(compile)
    if (cidx > -1 && cidx !== 0) {
      invokable.splice(cidx, 1)
    }
    invokable.unshift(compile)
    // Detect if $scope injection is needed and remove it as dependency
    const sidx = invokable.indexOf('$scope')
    if (sidx > -1) {
      injectScope = true
      invokable.splice(sidx, 1)
    }
  }
  const extend = invokable.pop()
  const $elt = $(selector).empty()
  const $parent = $elt.scope()
  const $scope = $parent.$new(false, $parent)
  $elt.injector().invoke(invokable.concat(function ($compile, ...rest) {
    if (injectScope) {
      rest.unshift($scope)
    }
    // If extend(...) returns something, replace $scope with that
    $elt.append($compile(template)(extend(...rest) || $scope))
  }))
})(
  require('./controller'),
  '[ui-view]',
  require('fs').readFileSync('./src/verify_sightings/template.html', 'utf8')
)
