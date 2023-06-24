require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = server;
