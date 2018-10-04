(function (d, s, id, path) {
  var src = d.createElement(s)
  src.addEventListener('error', function (evt) {
    const msg = 'An error occurred and the bookmarklet could not be loaded.'
    return window.alert(msg)
  }, { once: true })
  src.src = path + id + '.js'
  d.head.appendChild(src)
}(document, 'script', '__ID__', '__PATH__'))
