require("dotenv").config()
const express = require("express")
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Setup your Middleware and API Router here
const apiRouter = require('./api')
app.use('/api', apiRouter)

module.exports = app;
