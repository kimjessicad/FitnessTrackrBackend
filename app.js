require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require('morgan');
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const apiRouter = require("./api");
app.use("/api", apiRouter);

app.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
    error: error.message,
  });
});

module.exports = app;
