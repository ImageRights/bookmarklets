;(() => {
  'use strict'
  if (location.hostname !== 'www.imagerights.com') {
    location.href = 'https://www.imagerights.com/admin'
    return
  } else if (!window._babelPolyfill) {
    require('@babel/polyfill')
  }
  if (location.pathname === '/admin') {
    const {$state} = require('./injector')
    if ($state.includes('cases.detail')) {
      require('./from_case')
    } else {
      return alert('Not currently viewing a case.')
    }
  } else if (location.pathname === '/private') {
    return require('./as_user')
  } else {
    return alert('Not sure what to do...')
  }
})()
