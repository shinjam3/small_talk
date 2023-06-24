const jwt = require('jsonwebtoken');

// middleware function to check if user has a jwt from the front-end
module.exports = function (req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Unauthorized.');

    // the verify method will return the payload of the jwt if valid
    const payload = jwt.verify(token, process.env.ST_JWTPRIVATEKEY);
    req.userId = payload._id;

    // finishes this function and starts next middleware function
    next();
  } catch (err) {
    res.status(401).send('Unauthorized.');
  }
};
