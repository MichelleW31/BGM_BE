const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;
const userController = require("./controllers/userController");
const registerController = require("./controllers/registerController");
const authController = require("./controllers/authController");

//Log middleware calls
app.use(logger);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//Serve static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

//Built in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//Built in middleware for json
app.use(express.json());

//API CALLS
app.get("^/$|/index.html/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.get("/user", (req, res) => {
  userController.getUser(req, res);
});

app.post("/signup", (req, res) => {
  userController.createNewUser(req, res);
});

app.post("/register", (req, res) => {
  registerController.handleNewUser(req, res);
});

app.post("/auth", (req, res) => {
  authController.handleLogin(req, res);
});

//Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
