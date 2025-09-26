const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/userController");

const { login } = require("../controllers/authController");

// POST /api/signup
router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
