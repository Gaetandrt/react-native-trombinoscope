const express = require('express');
const axios = require('axios');
var cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:19006', 'http://127.0.0.1:19006', '*'],
}));

require('./masurao_api.js')(app);

module.exports = app;
