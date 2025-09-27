const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/userController");

const { login } = require("../controllers/authController");


// import { forgotPassword, resetPassword } from "../controllers/passwordController.js";
const { forgotPassword, resetPassword } = require("../controllers/passwordController");

// POST /api/signup
router.post("/signup", signup);

router.post("/login", login);


router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
