const fs = require('fs')

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

try {
	fs.unlinkSync(__dirname + "/../error_503/config-overrides.js")
} catch {
	console.log('no config-overrides to delete')
}

fs.symlink(__dirname + "/../tailwind.config.js",
        __dirname + '/../error_503/tailwind.config.js', 'file', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("\nSymlink to tailwind.config.js created");
  }
})

fs.symlink(__dirname + "/../gulpfile.js",
        __dirname + '/../error_503/gulpfile.js', 'file', (err) => {
  if (err)
    console.log(err);
  else {
    console.log("\nSymlink to gulpfile.js created");
  }
})

fs.symlink(__dirname + "/../config-overrides.js",
		__dirname + '/../error_503/config-overrides.js', 'file', (err) => {
	if (err)
		console.log(err);
	else {
		console.log('\nSymlink to config-overrides.js created')
	}
})
