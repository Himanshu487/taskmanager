const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/userRoutes");

const dotenv = require("dotenv");
dotenv.config();

const app = express();


app.use(express.json()); // parse JSON body

mongoose.connect("mongodb://localhost:27017/myAppDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api", authRoutes); // use signup route

app.listen(5000, () => console.log("Server running on port 5000"));
