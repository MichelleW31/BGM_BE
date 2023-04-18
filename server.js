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
const refreshTokenController = require("./controllers/refreshTokenController");
const logoutController = require("./controllers/logoutController");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const ROLES_LIST = require("./config/roles_list");
const verifyRoles = require("./middleware/verifyRoles");

//Log middleware calls
app.use(logger);

//Handle options credentials check - before CORS and fetch cookies credentials requirement
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//Serve static files
app.use(express.static(path.join(__dirname, "../BGM_FE/build")));

//Built in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//Built in middleware for json
app.use(express.json());

//Middleware for cookies
app.use(cookieParser());

//API CALLS
app.get("^/$|/index.html/", (req, res) => {
  res.sendFile(path.join(__dirname, "../BGM_FE/build", "index.html"));
});

//Signup
app.post("/register", (req, res) => {
  registerController.handleNewUser(req, res);
});

//Login
app.post("/auth", (req, res) => {
  authController.handleLogin(req, res);
});

//Logout
app.get("/logout", (req, res) => {
  logoutController.handleLogout(req, res);
});

//Refresh token controller
app.get("/refresh_token", (req, res) => {
  refreshTokenController.handleRefreshToken(req, res);
});

//Get users
app.get("/users", (req, res) => {
  verifyJWT(req, res);
  verifyRoles(req, res, ROLES_LIST.Admin);
  userController.getUsers(req, res);
});

//Need to add put to update users
//Need to add delete to delete users

//Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
