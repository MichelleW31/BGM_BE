const getUser = (req, res) => {
  // const user = users.find((user) => user.id === parseInt(req.params.id));

  // if (!user) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee ID ${req.params.id} not found` });
  // }

  // res.json(user);
  console.log("user retrieved");
};

const createNewUser = (req, res) => {
  const newUser = {
    id: 1,
    username: req.body.username,
    password: req.body.password,
  };

  if (!newUser.username || !newUser.password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  res.send(newUser);
  console.log("new user created", newUser);
};

module.exports = { getUser, createNewUser };
