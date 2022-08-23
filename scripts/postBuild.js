const symlinkDir = require('symlink-dir')
const fs = require('fs')

symlinkDir('./node_modules', './error_503/node_modules')

try {
	fs.unlinkSync(__dirname + "/../error_503/tailwind.config.js")
} catch {
	console.log('no taiwild.config.js to delete')
}

try {
	fs.unlinkSync(__dirname + "/../error_503/gulpfile.js")
} catch {
	console.log('no gulpfile.js to delete')
}

fs.symlink(__dirname + "/../tailwind.config.js",
        __dirname + '/../error_503/tailwind.config.js', 'file', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("\nSymlink created\n");
  }
})

fs.symlink(__dirname + "/../gulpfile.js",
        __dirname + '/../error_503/gulpfile.js', 'file', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("\nSymlink created\n");
  }
})
