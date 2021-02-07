const config = require('config');

// gets jwtPrivateKey from env variable
module.exports = function() {
	if (!config.get('jwtPrivateKey')) {
		throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
		process.exit(1);
	}
}