import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "himanshuatkaan66@gmail.com",
    pass: "nmisgvudajjnzjga"
  }
});

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Generate token (valid 15 min)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: "youremail@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click this link to reset your password: ${resetLink}`
    });

    res.json({ msg: "Reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ msg: "Invalid token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};
