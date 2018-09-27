// Load and export a list of search functions
// ;['ldJson', 'ogImageUrl', 'query', 'text', 'url'].forEach(str => {
//   exports[str] = require('./' + str)
// })
module.exports = {
  ldJson: require('./ldJson'),
  ogImageUrl: require('./ogImageUrl'),
  query: require('./query'),
  text: require('./text'),
  url: require('./url')
}
