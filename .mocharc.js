module.exports = {
    exit: true,
    bail: false,
    require: ['./tests/global.ts'],
    // NOTE: by default mocha uses serial mode
    timeout: 60000,
    reporter: 'spec',
	spec: ['./tests/**/*.test.ts']
}
