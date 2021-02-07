const jwt = require('jsonwebtoken');
const config = require('config');

// middleware function to check if user has a jwt from the front-end
module.exports = function (req, res, next) {
	const token = req.header('x-auth-token');
	if (!token) return res.status(401).send('Access denied. No token provided.');

	try {
		// the verify method will return the payload of the jwt if valid
		jwt.verify(token, config.get('jwtPrivateKey'));
		// finishes this function and starts next middleware function
		next();
	}
	catch (ex) {
		res.status(400).send('Invalid token.');
	}
}