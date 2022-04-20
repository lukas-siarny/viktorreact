const fs = require('fs')

const readFile = fs.readFileSync
const writeFile = fs.writeFileSync

const { forEach } = require('lodash')

const file = fs.readdirSync('./public/translations.csv')


const fileContent = readFile(file, 'utf-8')
