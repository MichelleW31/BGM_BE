const User = require("../model/User");

const handleLogout = async (req, res) => {
  //On client, also delete the accessToken from the memory of the client when the user logouts. Cant do this on the backend.

  const cookies = req.cookies;

  if (!cookies?.jwt) {
    //204 means no content to send back. If jwt cookie doesn't exist then thats what
    //we want.
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  //Is the refresh token in the DB
  const foundUser = await User.findOne({ refreshToken }).exec();

  // Refresh token isn't in the database but there is a cookie. We want to delete cookie.
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  //Delete refreshtoken found in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure: true( only serves on https) this needs to be added for production
  res.sendStatus(204);
};

module.exports = { handleLogout };
