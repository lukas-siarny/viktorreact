const fs = require('fs')
const csvWriter = require('csv-writer')
const csvJson = require('csvjson')

const readFile = fs.readFile
const writeFile = fs.writeFile


const { forEach } = require('lodash')

const files = fs.readdirSync('./public/locales')

if (process.env.LANGUAGES) {
	languages = process.env.LANGUAGES.split(',')
}

if (process.env.TYPES) {
	fileTypes = process.env.TYPES.split(',')
}

console.log('env: ', languages, fileTypes)

// going through all language mutations folders
forEach(files, (firstFileName) => {
	// load directory for specific language
	dir = fs.readdirSync(`./public/locales/${firstFileName}`)
	forEach(dir, (secondFileName) => {
		// going through all files inside specific language directory
		if (secondFileName !== 'keep-empty.json') {
			let json = require(`../public/locales/${firstFileName}/${secondFileName}`)
			// console.log(json, 'the json obj')
			// Reading json file(filename -data.json)
			readFile(`./public/locales/${firstFileName}/${secondFileName}`, 'utf-8', (err, fileContent) => {
				if (err) {
					// Doing something to handle the error or just throw it
					console.log(err);
					throw new Error(err);
				}

				// Convert json to csv function
				const csvData = csvJson.toCSV(fileContent, {
					headers: 'key'
				});

				// Write data into csv file named college_data.csv
				writeFile('./public/locales/parsed_data.csv', csvData, (err) => {
					if(err) {
						// Do something to handle the error or just throw it
						console.log(err);
						throw new Error(err);
					}
					console.log('Data stored into csv file successfully');
				});
			});
		}
	})

})

