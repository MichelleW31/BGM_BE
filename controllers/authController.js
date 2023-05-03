const User = require("../model/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  //Look for user.
  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.sendStatus(401); //Unauthorized User
  }

  //Evaluate password (authorize login)
  const passwordMatch = await bcrypt.compare(password, foundUser.password);

  if (passwordMatch) {
    const roles = Object.values(foundUser.roles);

    //Create JWTs (access tokens)
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
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
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      // Add back in when pushing to production. This blocks Thunderclient testing
      // secure: true,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); //Unauthorized User(password doesnt match)
  }
};

module.exports = { handleLogin };
