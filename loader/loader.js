(function (d, s, id, path) {
  var peer = d.getElementsByTagName(s)[0]
  var src = d.createElement(s)
  src.src = path + id + '.js'
  peer.parentNode.insertBefore(src, peer)
}(document, 'script', '__ID__', '__PATH__'))
