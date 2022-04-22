const fs = require('fs')

const readFile = fs.readFileSync
const writeFile = fs.writeFileSync

const { forEach } = require('lodash')

const files = fs.readdirSync('./public/locales')

const checkOptionInArray = (array, option) => {
	if (!array){
		return false
	}
	return !!array.find((arrayElement) => arrayElement === option)
}

const generateCSV = (languages, fileTypes, filePaths) => {
	console.log('languages: ', languages || 'default', '| fileTypes: ', fileTypes || 'default')
	try {
		let languageDirs = []
		let locKeys = {}
		let locText = {}
		let files = []
		let loadedKeys = false
		// going through all language mutations folders
		forEach(filePaths, (languageMutation) => {
			// load directory for specific language and check if is
			if (checkOptionInArray(languages, languageMutation) || !languages) {
				const dir = fs.readdirSync(`./public/locales/${languageMutation}`)
				// add language mutation to array
				languageDirs.push(languageMutation)
				let keys = []
				forEach(dir, (fileName) => {
					const name = fileName?.split('.')?.[0]
					// going through all files inside specific language directory
					if (checkOptionInArray(fileTypes, name) || !fileTypes) {
						// load json file content
						const fileContent = readFile(`./public/locales/${languageMutation}/${fileName}`, 'utf-8')
						// get all keys for translations
						const json = JSON.parse(fileContent)
						// prepare loc text
						locText = {
							...locText,
							[languageMutation]: {
								...locText[languageMutation],
								[name]: json
							}
						}
						// init all available loc keys and file names
						if (!loadedKeys) {
							keys = Object.keys(json)
							locKeys = {
								...locKeys,
								[name]: keys
							}
							files.push(name)
						}
					}
				})
				// only if keys is not empty
				if (keys && keys.length > 0) {
					// after first iteration do not load keys and file names
					loadedKeys = true
				}
			}
		})

		// init buffer
		let buffer = 'Keys;'
		// create csv header with columns
		forEach(languageDirs, (languageMutation, index) => {
			buffer = `${buffer} ${languageMutation} ${(index !== languageDirs.length - 1) ? ';' : ''}`
		})
		// add new line
		buffer = `${buffer}\n`
		forEach(files, (fileName) => {
			// if json file is empty
			if (locKeys?.[fileName] && locKeys?.[fileName].length > 0) {
				buffer = `${buffer}--${fileName}--`
				// add rows to csv file
				forEach(locKeys?.[fileName], (key) => {
					buffer = `${buffer}\n ${key}`
					// each loc key add translation to column for specific language mutation
					forEach(languageDirs, (languageMutation) => {
						// create row for specific language mutation, file and key
						buffer = `${buffer}; ${locText?.[languageMutation]?.[fileName]?.[key]}`
					})
				})
				// new line for specific file
				buffer = `${buffer}\n`
			}
		})

		// write data into csv file
		writeFile('./public/translations.csv', buffer)
		console.log('Data generated into csv file successfully!')
	} catch (error) {
		console.error(error)
		throw new Error(error)
	}
}

generateCSV(process.env.LANGUAGES?.split(','), process.env.TYPES?.split(','), files)
