module.exports = function () {
  if (!process.env.ST_JWTPRIVATEKEY) {
    throw new Error("FATAL ERROR: JWT private key is not defined.");
  }
};
