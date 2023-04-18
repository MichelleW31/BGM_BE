const usersDB = {
  users: require("../model/users.json"),
  //   users: require("../model/User"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  //On client, also delete the accessToken from the memory of the client when the user logouts. Cant do this on the backend.

  const cookies = req.cookies;

  if (!cookies?.jwt) {
    //204 means no content to send back. If jwt cookie doesn't exist then thats what
    //we want.
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  //Is the refresh token in the DB?
  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );

  // Refresh token isn't in the database but there is a cookie. We want to delete cookie.
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  //Delete refreshtoken found in db
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );

  const currentUser = { ...foundUser, refreshToken: "" };

  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "../model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure: true( only serves on https) this needs to be added for production
  res.sendStatus(204);
};

module.exports = { handleLogout };
