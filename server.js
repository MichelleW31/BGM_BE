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
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
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

app.use("/", require("./routes/rootRoute"));
app.use("/register", require("./routes/registerRoute"));
app.use("/auth", require("./routes/authRoute"));
app.use("/logout", require("./routes/logoutRoute"));
app.use("/refresh_token", require("./routes/refreshTokenRoute"));

app.use(verifyJWT);
app.use("/users", require("./routes/userRoutes"));

//Error Handler
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to DB");

  app.listen(PORT, () => {
    console.log(`App running on ${PORT}`);
  });
});
