const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const machineRoutes = require("./routes/machine");

const app = express();

mongoose
  .connect("mongodb://localhost/wimer-task2")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to Mongo DB...", err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/machines", machineRoutes);

module.exports = app;
