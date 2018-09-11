(function (d, s, id, path) {
  if (d.getElementById(id)) {
    return alert('Already loaded boomkarklet.')
  }
  var peer = d.getElementsByTagName(s)[0]
  var src = d.createElement(s)
  src.id = 'IR-bm-' + id
  src.src = 'https://cdn.rawgit.com/wjhir/bookmarklets/master/dist/' + id + '.js'
  peer.parentNode.insertBefore(src, peer)
}(document, 'script', '__ID__'))
