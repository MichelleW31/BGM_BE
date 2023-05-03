const User = require("../model/User");

const bcrypt = require("bcryptjs");

//New user created
const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  //Check for duplicate usernames in the database
  const duplicate = await User.findOne({ username }).exec();

  if (duplicate) {
    return res.sendStatus(409); //Conflict error code
  }

  try {
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create and store the new user
    const userResult = await User.create({
      username: username,
      password: hashedPassword,
      //roles is being set by default by the model
      //id is also created
    });

    console.log(userResult);

    res.status(201).json({ success: `New user ${username} created!` }); //Successful
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ message: error.message }); //Server error code
  }
};

module.exports = { handleNewUser };
