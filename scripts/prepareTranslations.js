const fs = require('fs')
const csvJson = require('csvjson')

const readFile = fs.readFileSync
const writeFile = fs.writeFileSync

const { forEach } = require('lodash')

const files = fs.readdirSync('./public/locales')

if (process.env.LANGUAGES) {
	languages = process.env.LANGUAGES.split(',')
}

if (process.env.TYPES) {
	fileTypes = process.env.TYPES.split(',')
}

console.log('env: ', languages, fileTypes)

const checkOptionInArray = (array, option) => {
	return !!array.find((arrayElement) => arrayElement === option)
}

try {
	let languageDirs = []
	let locKeys = []
	let locText = {}
	let buf = 'Loc keys|'
	let loadedKeys = false
	// going through all language mutations folders
	forEach(files, (languageMutation) => {
		// load directory for specific language and check if is
		if (checkOptionInArray(languages, languageMutation) || !languages) {
			const dir = fs.readdirSync(`./public/locales/${languageMutation}`)
			// add language mutation to array
			languageDirs.push(languageMutation)
			forEach(dir, (fileName) => {
				// going through all files inside specific language directory
				if (checkOptionInArray(fileTypes, fileName.split('.')?.[0]) || !fileTypes) {
					// reading json file
					const fileContent = readFile(`./public/locales/${languageMutation}/${fileName}`, 'utf-8')
					// get all keys for translations
					const json = JSON.parse(fileContent)
					locText = {
						...locText,
						[languageMutation]: {
							...locText[languageMutation],
							...json
						}
					}
					if (!loadedKeys) {
						locKeys = [...locKeys, ...Object.keys(json)]
					}
				}
			})
			// first iteration get all loc keys
			loadedKeys = true
		}
	})

	console.log('locText: ', locText)
	console.log('locKeys: ', locKeys)
	forEach(languageDirs, (languageMutation) => {
		buf = `${buf} ${languageMutation} |`
	})

	forEach(locKeys, (key) => {
		buf = `${buf}\n${key}`
		forEach(languageDirs, (languageMutation) => {
			buf = `${buf}| ${locText?.[languageMutation]?.[key]}`
		})
	})

	// Write data into csv file
	writeFile('./public/parsed_data.csv', buf, (err) => {
		if (err) {
			console.error(err)
			throw new Error(err)
		}
	})
	console.log('Data generated into csv file successfully!')
} catch (error) {
	console.error(error)
	throw new Error(error)
}
