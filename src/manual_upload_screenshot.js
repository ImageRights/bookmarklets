;((submitUrl, updatesUrl, html) => {
  'use strict'
  async function uploadFiles () {
    const $scope = this
    try {
      const state = $scope.upload
      const win = state.windowFile
      if (!win) {
        throw new Error('Cannot upload a screenshot without a screenshot!')
      }
      const full = state.fullFile
      if (full && win.name === full.name) {
        throw new Error('Cannot upload two files with the same name.')
      }
      const caseId = $scope.case.id
      const urlId = $scope.sighting.id
      const winName = `case-${caseId}-url-${urlId}-window.png`
      const fullName = `case-${caseId}-url-${urlId}-full.png`
      const lastModified = new Date(win.lastModified).toUTCString()
      const data = new FormData()
      data.set('case_id', caseId)
      data.set('case_url_id', urlId)
      data.set('screenshot', win, winName)
      if (full) {
        data.set('full_screenshot', full, fullName)
      }
      data.set('last_modified', lastModified)
      state.uploading = true
      const json = await request(submitUrl, { method: 'POST', body: data })
      if (json.status !== 'ok' || typeof json.window_url !== 'string') {
        const err = new Error('Did not receive expected response from upload.')
        err.json = json
        throw err
      }
      const updates = await request(updatesUrl + caseId)
      if (!Array.isArray(updates)) {
        // Upload succeeded but request for new thumbnail url failed;
        // reloading the page should make it work
        return location.reload()
      }
      const imgId = $scope.img.id
      const img = updates.find(img => img.id === imgId)
      if (!img) {
        return location.reload()
      }
      const sighting = img.urls.find(sgt => sgt.id === urlId)
      if (!sighting) {
        return location.reload()
      }
      $scope.sighting.thumb = sighting.thumb
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      $scope.reset()
    }
  }
  async function request (url, _cfg = {}) {
    const cfg = Object.assign({ credentials: 'include' }, _cfg)
    const res = await fetch(url, cfg)
    if (res.status !== 200 || res.redirected) {
      const err = new Error('An error occurred while uploading.')
      err.response = res
      throw err
    }
    return res.json()
  }
  function getWindowFile (input) {
    const state = this.upload
    const file = input.files[0]
    state.windowChosen = !!file
    state.windowFile = file
  }
  function getFullFile (input) {
    const state = this.upload
    const file = input.files[0]
    state.fullChosen = !!file
    state.fullFile = file
  }
  function resetForm (container) {
    console.log('Resetting')
    const $scope = this
    const state = $scope.upload
    const inputs = container.find('input[type=file]')
    inputs.each((idx, elt) => console.log(elt.files[0]))
    inputs.each((idx, elt) => elt.onchange())
    $scope.$apply(() => {
      state.windowChosen = state.fullChosen = state.uploading = false
      state.windowFile = state.fullFile = null
      inputs.each((idx, elt) => console.log(elt.files[0]))
    })
  }
  jQuery('.row[ng-repeat]')
    .find('img + span')
    .each((idx, container) => {
      const $c = $(container)
      const $parent = $c.scope()
      const $scope = $parent.$new(false, $parent)
      const reset = resetForm.bind($scope, $c)
      Object.assign($scope, { uploadFiles, getWindowFile, getFullFile, reset })
      $scope.upload = {
        windowFile: null,
        fullFile: null,
        windowChosen: false,
        fullChosen: false,
        uploading: false
      }
      $c.injector().invoke(['$compile', function ($compile) {
        $c.append($compile(html)($scope))
      }])
    })
})(
  '/api/v1/admin/screenshot/submit_screenshots',
  '/api/v1/admin/case_images?case_id=',
  `
<label>
  <input class="hidden" type="file" accept="image/*" onchange="$(this).scope().getWindowFile(this)">
  <div class="ha-icon-toggle hit-purple" ng-class="{active:upload.windowChosen}" tooltip="choose screenshot" tooltip-placement="right">
    <span class="glyphicon glyphicon-paperclip"></span>
  </div>
</label>
<label>
  <input class="hidden" type="file" accept="image/*" onchange="$(this).scope().getFullFile(this)">
  <div ng-show="upload.windowChosen" class="ha-icon-toggle hit-purple" ng-class="{active:upload.fullChosen}" tooltip="choose full screenshot" tooltip-placement="right">
    <span class="glyphicon glyphicon-paperclip"></span>
  </div>
</label>
<div ng-click="uploadFiles()" ng-show="upload.windowChosen" ng-class="{active:upload.uploading}" class="ha-icon-toggle hit-danger" tooltip="upload screenshot{{upload.fullChosen ? 's' : ''}}" tooltip-placement="right">
  <span class="glyphicon glyphicon-cloud-upload"></span>
</div>
`)
