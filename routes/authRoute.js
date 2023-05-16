const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/", authController.handleLogin);

module.exports = router;
// {"username": "MichelleW1931", "password": "MichelleW1931"}
// {"username": "MichelleW1931", "password": "MichelleW1931"}
