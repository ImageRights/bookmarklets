'use strict'
;((invokable, selector, template) => {
  if (!Array.isArray(invokable)) {
    invokable = ['$compile', invokable]
  } else {
    // Make sure $compile is always present and listed first
    const str = '$compile'
    const idx = invokable.indexOf(str)
    if (idx > -1) {
      invokable.splice(idx, 1)
    }
    invokable.unshift(str)
  }
  const extend = invokable.pop()
  $(selector)
    .each((idx, elt) => {
      const $elt = $(elt)
      const $parent = $elt.scope()
      const $scope = $parent.$new(false, $parent)
      $elt.injector().invoke(invokable.concat(function ($compile, ...rest) {
        // If extend returns something, replace $scope with that
        const $extended = extend($elt, $scope, ...rest, $compile) || $scope
        $elt.append($compile(template)($extended))
      }))
    })
})(['$upload',
  function ($parent, $scope, $upload) {
    const BASE = '/api/v1/image_registration/upload_image_attachment/ownership/'
    const id = $parent.scope().img.image_id
    const url = BASE + id
    $scope.choose = input => {
      const upl = $scope.upload
      upl.file = input.files[0]
      upl.chosen = !!upl.file
      $scope.$apply()
    }
    $scope.upload = () => {
      const upl = $scope.upload
      upl.active = true
      $upload.upload({
        url: url,
        file: upl.file
      }).success(() => {
        upl.file = upl.chosen = upl.active = null
        $parent.find('a').text('yes')
      })
    }
    $scope.hello = () => console.log('hello')
    Object.assign($scope.upload, {
      file: null,
      chosen: null,
      active: null
    })
  }],
// Selector
'.table tr.ng-scope > td:nth-child(4)',
// Template
`
<br>
<label>
<input class="hidden" type="file" ng-file-select="hello" onchange="console.log(this)||$(this).scope().choose(this)">
<span class="ha-icon-toggle hit-purple" ng-class="{active:upload.chosen}">
<span class="glyphicon glyphicon-paperclip"></span> {{upload.file.name}}
</span>
</label>
<span ng-click="upload()" ng-show="upload.chosen" ng-class="{active:upload.active}" class="ha-icon-toggle hit-danger">
<span class="glyphicon glyphicon-cloud-upload"></span>
</span>
`)
