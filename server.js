require("dotenv").config();
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
const connectDB = require("./config/dbConn");

// Connect to DB
connectDB();

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

//////USER ROUTES - MOVE TO ROUTES FILE//////
app.get("/users", (req, res) => {
  verifyJWT(req, res);
  verifyRoles(req, res, ROLES_LIST.Admin);
  userController.getUsers(req, res);
});

app.put("/users", (req, res) => {
  verifyJWT(req, res);
  verifyRoles(req, res, ROLES_LIST.Admin, ROLES_LIST.Editor);
  userController.updateUser(req, res);
});

app.delete("/users", (req, res) => {
  verifyJWT(req, res);
  verifyRoles(req, res, ROLES_LIST.Admin);
  userController.deleteUser(req, res);
});

app.get("/users/:id", (req, res) => {
  verifyJWT(req, res);
  userController.getUser(req, res);
});

//Error Handler
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to DB");

  app.listen(PORT, () => {
    console.log(`App running on ${PORT}`);
  });
});
