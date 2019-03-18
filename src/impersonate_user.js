;(async function () {
  'use strict'
  const nonDigit = n => /\D/.test(n)
  let id = getSelection().toString().trim()
  if (id && nonDigit(id)) {
    return alert('Selected text is not a number.')
  }
  const IR = 'https://www.imagerights.com'
  const isIR = location.origin === IR
  id = prompt(`Enter a user ID${isIR ? ' or search query' : ''}:`)
  id = id && id.trim()
  if (!id) {
    return
  }
  if (nonDigit(id)) {
    if (!isIR) {
      return alert('Entered text is not a number.')
    }
    const query = encodeURIComponent(id)
    const url = `${IR}/api/v1/admin/users?filter=${query}&per_page=2`
    const users = await fetch(url).then(res => res.json())
    const active = users.filter(u => u.active)
    if (active.length === 1) {
      id = active[0].id
    } else {
      location.href = `admin#/users?q=${query}`
      return
    }
  } // else ID is number; use as is
  location.href = `${IR}/admin_impersonation/${id}`
})()
