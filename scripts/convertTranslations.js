const fs = require('fs')
const prettier = require('prettier')

const readFile = fs.readFileSync
const writeFile = fs.writeFileSync

const { forEach } = require('lodash')

const regFileType = new RegExp('^(--)[a-zA-Z0-9]*(--)$')

const filePath = process.env.FILEPATH || './public/translations.csv'

const convert = (filePath) => {
	try {
		const fileContent = readFile(filePath, 'utf-8')
		// read file by lines
		let languages = []
		let files = []
		let actualFile = ''
		let result = {}
		forEach(fileContent.split('\n'), (text, index) => {
			// first line get language mutations
			if (index === 0) {
				forEach(text.split(';'), (language, index) => {
					if (index > 0) {
						languages.push(language.trim())
					}
				})
			} else {
				// check if is new file
				if (regFileType.test(text)) {
					// replace identifier '--' for new file
					const fileName = text.replace(/--/gm, '')
					files.push(fileName)
					// save actual file name
					actualFile = fileName
				} else {
					const locKey = text.split(';')?.[0].trim()
					// go through table columns and get text for specific language
					forEach(text.split(';'), (columnText, index) => {
						// skip first column with loc key
						if (index > 0) {
							// add key and column for specific file and
							result = {
								...result,
								// language mutation
								[languages[index - 1]]: {
									...result?.[languages[index - 1]],
									// file loc, paths atc...
									[actualFile]: {
										...result?.[languages[index - 1]]?.[actualFile],
										// loc ket with value for specific language
										[locKey]: columnText.trim()
									}
								}
							}
						}
					})
				}
			}
		})
		// get language keys
		const languagesKeys = Object.keys(result)
		forEach(languagesKeys, (languagesKey) => {
			// write data into json files
			const fileKeys = Object.keys(result[languagesKey])
			forEach(fileKeys, (fileKey) => {
				// check if directory for language exist
				if (!fs.existsSync(`./public/locales/${languagesKey}`)){
					// create directory if not exist
					fs.mkdirSync(`./public/locales/${languagesKey}`)
				}
				// write parsed data to file
				const fileContent = prettier.format(JSON.stringify(result[languagesKey][fileKey]),{ semi: true, parser: 'json' })
				writeFile(`./public/locales/${languagesKey}/${fileKey}.json`, fileContent,'utf8')
			})
		})
		console.log('Detected languages: ', languages, ' | ', 'Detected files: ', files)
		console.log('Data generated into files successfully!')
	} catch (error) {
		console.error(error)
		throw new Error(error)
	}
}

if (fs.existsSync(filePath)) {
	convert(filePath)
} else {
	console.log(`Error when loading file! No such file or directory, trying open '${filePath}'.`)
}
