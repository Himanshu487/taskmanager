const User = require("../models/User");
const bcrypt = require("bcrypt");

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Incoming login:", email, password); // 👈 debug

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user.email);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Success
    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message); // 👈 more useful log
    res.status(500).json({ message: "Server error login" });
  }
};
