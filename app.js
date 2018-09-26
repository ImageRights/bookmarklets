;(function () {
  'use strict'
  var app = angular.module('bookmarklets', [])
  app.config([
    '$compileProvider',
    function ($compileProvider) {
      var regex = /^\s*(https?|javascript):/
      $compileProvider.aHrefSanitizationWhitelist(regex)
    }
  ])
  app.directive('irBmlet', ['$http', function ($http) {
    function load (url) {
      return $http.get(url).then(function (response) {
        return response.data
      })
    }
    var loader = load('./loader/loader.url')
    function link (scope, elt, attrs) {
      var info = attrs.irBmlet.split(' ')
      var type = info[0]
      var name = info[1]
      if (type === 'load') {
        return loader.then(function (bmlet) {
          elt.attr('href', bmlet.replace('__ID__', name))
        })
      } else if (type === 'static') {
        return load('./static/' + name + '.url').then(function (bmlet) {
          elt.attr('href', bmlet)
        })
      } // Else shouldn't happen
    }
    return { restrict: 'A', link: link }
  }])
})()
