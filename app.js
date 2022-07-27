require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

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
