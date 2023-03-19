const usersDB = {
  users: require("../model/users.json"),
  //   users: require("../model/User"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  //Check for duplicate usernames in the database
  const duplicate = usersDB.users.find((user) => user.username === username);

  if (duplicate) {
    return res.sendStatus(409); //Conflict error code
  }

  try {
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //store the new user
    const newUser = {
      username: username,
      password: hashedPassword,
    };

    usersDB.setUsers([...usersDB.users, newUser]);

    //This is where you will be writing to the database
    //Delete this once you connect to the database
    await fsPromises.writeFile(
      path.join(__dirname, "../model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    console.log(usersDB.users);

    res.status(201).json({ success: `New user ${username} created!` }); //Successful
  } catch (error) {
    res.status(500).json({ message: error.message }); //Server error code
  }
};

module.exports = { handleNewUser };
