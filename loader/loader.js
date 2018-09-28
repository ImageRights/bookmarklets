(function (d, s, id, path) {
  if (d.getElementById(id)) {
    return alert('Already loaded boomkarklet.')
  }
  var peer = d.getElementsByTagName(s)[0]
  var src = d.createElement(s)
  src.id = 'IR-bm-' + id
  src.src = path + id + '.js'
  peer.parentNode.insertBefore(src, peer)
}(document, 'script', '__ID__', '__PATH__'))
