const Task = require("../models/Task");
const Activity = require("../models/Activity");

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate("project");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project } = req.body;
    const newTask = new Task({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      dueDate,
      project,
      user: req.user.id,
    });
    await newTask.save();

    // Log activity
    await new Activity({
      user: req.user.id,
      action: "Created task",
      details: `Task "${title}" created`,
    }).save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.project = project || task.project;
    await task.save();

    // Log activity
    await new Activity({
      user: req.user.id,
      action: "Updated task",
      details: `Task "${title}" updated`,
    }).save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    await task.remove();

    // Log activity
    await new Activity({
      user: req.user.id,
      action: "Deleted task",
      details: `Task "${task.title}" deleted`,
    }).save();

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
