const symlinkDir = require('symlink-dir')
const fs = require('fs')

symlinkDir('./node_modules', './error_503/node_modules')

if (fs.existsSync('./error_503/tailwind.config.js')) {
	fs.unlinkSync('./error_503/tailwind.config.js')
}
if (fs.existsSync('./error_503/gulpfile.js')) {
	fs.unlinkSync('./error_503/gulpfile.js')
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
