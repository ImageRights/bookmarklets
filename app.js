;(function () {
  'use strict'
  var app = angular.module('bookmarklets', [])
    .config([
      '$compileProvider',
      function ($compileProvider) {
        var regex = /^\s*(https?|javascript):/
        $compileProvider.aHrefSanitizationWhitelist(regex)
      }
    ])
  app.controller('main', function ($scope, $http) {
    angular.element('a[ng-href]').each(function (idx, elt) {
      var name = angular.element(elt).attr('ng-href').slice(2, -2)
      if ($scope.hasOwnProperty(name)) {
        throw new Error('Duplicate name: ' + name)
      }
      $http.get('dist/' + name + '.url').then(function (res) {
        $scope[name] = res.data
      })
    })
  })
})()
