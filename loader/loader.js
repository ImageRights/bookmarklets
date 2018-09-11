(function (d, s, id, path) {
  if (d.getElementById(id)) {
    return
  }
  var peer = d.getElementsByTagName(s)[0]
  var src = d.createElement(s)
  src.id = 'IR-bm-' + id
  src.src = 'https://www.imagerights.com/' + id + '.js'
  peer.parentNode.insertBefore(src, peer)
}(document, 'script', '__ID__'))
