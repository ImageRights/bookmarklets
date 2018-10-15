(function (d, s, id, path) {
  function onError (e) {
    window.alert('An error occurred and the bookmarklet could not be loaded.')
  }
  try {
    var src = d.createElement(s)
    src.addEventListener('error', onError, { once: true })
    src.src = path + id + '.js'
    d.head.appendChild(src)
  } catch (e) {
    onError(e)
  }
}(document, 'script', '__ID__', '__PATH__'))
