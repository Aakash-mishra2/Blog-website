//core ideal is app.js file should have connection to database because we need to store
//data in there only.k
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require("./models/http-errors");
app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("We do not support this route yet.", 404);
  throw error;
});

app.use((error, req, res, next) => {

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({ message: error.message || "An unknown error occured." });
});
//we want to make sure our backend is connected to database before server is connected
//if not connected then only start server.s
mongoose
  .connect('mongodb+srv://sky:hellosky@cluster0.kfazawl.mongodb.net/Blogs?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000, function () {
      console.log("Server started on port 5000");
    });
  })
  .catch(err => {
    console.log(err);
  });