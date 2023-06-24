const mongoose = require('mongoose');

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.userId)) return res.status(401).send('Unauthorized.');
  next();
};
