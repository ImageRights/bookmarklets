module.exports = {
  "extends": "standard",
  "env": {
    "browser": true
  },
  "globals": {
    "jQuery": false,
    "$": false,
    "angular": false
  },
  "rules": {
    "curly": ["error", "all"],
    "brace-style": ["error", "1tbs", {"allowSingleLine": false}]
  }
}
