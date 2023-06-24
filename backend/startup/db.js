const mongoose = require('mongoose');
//const config = require('config');

module.exports = function () {
  let db = process.env.ST_DB;
  /*if (!db.includes("&w=majority")) {
    db = db + "&w=majority";
  }*/

  mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));
};
