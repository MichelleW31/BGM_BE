const User = require("../model/User");

const getUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Id param is required" });
  }

  const user = await User.findOne({ _id: req.params.id }).exec();

  if (!user) {
    return res
      .status(204)
      .json({ message: `No employee ID matches ${req.params.id} ` });
  }

  res.json(user);
};

const getUsers = async (req, res) => {
  const users = await User.find();

  if (!users) return res.status(204).json({ message: "No users found" }); //No content

  res.json(users);
};

const updateUser = async (req, res) => {
  if (!req?.body.id) {
    return res.status(400).json({ message: "Id param is required" });
  }

  const user = await User.findOne({ _id: req.body.id }).exec();

  //Cant find user based off of id
  if (!user) {
    return res
      .status(204)
      .json({ message: `No employee ID matches ${req.body.id} ` });
  }

  //Update if user is found
  if (req.body?.username) {
    user.username = req.body.username;
  }
  if (req.body?.password) {
    user.password = req.body.password;
  }

  const result = await user.save();
  res.json(result);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "User Id is required" });
  }

  const user = await User.findOne({ _id: req.body.id }).exec();

  if (!user) {
    return res
      .status(204)
      .json({ message: `No employee ID matches ${req.body.id} ` });
  }
  const result = await user.deleteOne({ _id: req.body.id });

  res.json(result);
};

module.exports = { getUser, getUsers, updateUser, deleteUser };
