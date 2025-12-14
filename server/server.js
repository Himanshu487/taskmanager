const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const activityRoutes = require("./routes/activityRoutes");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors()); // enable CORS
app.use(express.json()); // parse JSON body

// Connect to database
connectDB().then(() => {
  app.use("/api", authRoutes); // use auth routes
  app.use("/api/projects", projectRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/activities", activityRoutes);

  app.listen(5000, () => console.log("Server running on port 5000"));
}).catch(err => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});
