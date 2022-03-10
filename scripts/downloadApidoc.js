const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')

const apidocPath = path.join(process.cwd(), 'apidoc')
const dataPath = path.join(apidocPath, 'data.json')

if(!fs.existsSync(apidocPath)) {
	fs.mkdirSync(apidocPath)
}

const download = function(url, dest, cb) {
	const file = fs.createWriteStream(dest);
  const protocol = url.startsWith('https') ? https : http
	protocol.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlinkSync(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

download(process.env.APIDOC, dataPath, console.log)
