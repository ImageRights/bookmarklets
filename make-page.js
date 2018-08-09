'use strict'
const fs = require('fs')
const {join} = require('path')
const ejs = require('ejs')
const DIR = join(__dirname, './dist')
const template = fs.readFileSync(join(__dirname, './template.ejs'), 'utf8')
const bookmarklets = fs.readdirSync(DIR)
  .filter(file => file[0] !== '.' && /\.js/i.test(file))
  .map(file => {
    return {
      name: file.slice(0, -3),
      url: fs.readFileSync(join(DIR, file), 'utf8')
    }
  })
const html = ejs.render(template, {bookmarklets})
const output = join(__dirname, 'index.html')
fs.writeFileSync(output, html, 'utf8')
console.log(output)
