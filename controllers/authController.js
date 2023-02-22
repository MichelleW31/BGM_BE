const usersDB = {
  users: require("../model/users.json"),
  //   users: require("../model/User"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

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

  //Evaluate password
  const passwordMatch = await bcrypt.compare(password, foundUser.password);

  if (passwordMatch) {
    //Create JWTs (access tokens)
    res.json({ success: `User ${username} is logged in!` });
  } else {
    res.sendStatus(401); //Unauthorized User(password doesnt match)
  }
};

module.exports = { handleLogin };
