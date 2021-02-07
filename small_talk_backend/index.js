const express = require('express');
const app = express();

require('./startup/config')();

require('./startup/db')();

require('./startup/routes')(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = server;