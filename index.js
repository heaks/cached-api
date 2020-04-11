const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api/routes');
require('dotenv').config({ path: __dirname + '/.env' });
require('./db');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());

app.use('/api', api);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});