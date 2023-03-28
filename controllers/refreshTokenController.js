const usersDB = {
  users: require("../model/users.json"),
  //   users: require("../model/User"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401); //Unauthorized User
  }

  const refreshToken = cookies.jwt;

  //Look for user.
  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );

  if (!foundUser) {
    return res.sendStatus(403); //Forbidden
  }

  //Evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403); //Forbidden
    }

    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
