const usersDB = {
  users: require("../model/users.json"),
  //   users: require("../model/User"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  //Look for user.
  const foundUser = usersDB.users.find((user) => user.username === username);

  if (!foundUser) {
    return res.sendStatus(401); //Unauthorized User
  }

  //Evaluate password (authorize login)
  const passwordMatch = await bcrypt.compare(password, foundUser.password);

  if (passwordMatch) {
    //Create JWTs (access tokens)
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      //15 minutes for production
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      //15 minutes for production
      { expiresIn: "1d" }
    );

    // Saving refreshToken with current user
    // We can invalidate the refresh token when the user logs out before 1 day has passed
    const otherUsers = usersDB.users.filter(
      (user) => user.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "../model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); //Unauthorized User(password doesnt match)
  }
};

module.exports = { handleLogin };
