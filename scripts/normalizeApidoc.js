const flatten = require("obj-flatten");
const { forEach, set } = require('lodash')
const fs = require('fs')
const path = require('path')

const data = require('../apidoc/data.json')
const res = flatten(data)

let i = 0

forEach(res, (value, key) => {
  if(/oneOf/.test(key)) {
    i += 1
    if(value.length <= 1) {
      console.log(i, key, value)
      set(data, key, undefined)
    }
  }
})
fs.writeFileSync(path.join(process.cwd(), 'apidoc', 'apidoc-normalize.json'), JSON.stringify(data))
