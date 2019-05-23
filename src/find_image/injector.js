'use strict'
const {get} = $(document.body).injector()
module.exports.get = get
module.exports.$http = get('$http')
module.exports.$state = get('$state')
