const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), userController.getUsers)
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User),
    userController.updateUser
  )
  .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser);

router.route("/:id").get(userController.getUser);

module.exports = router;
// {"username": "MichelleW31", "password": "MichelleW31"}
// {"id": "6463c415db27f012c3156738", "username": "Michelle3121"}
// {"id": "6463c415db27f012c3156738"}
