const Project = require("../models/Project");
const Activity = require("../models/Activity");

// Get all projects for a user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newProject = new Project({
      name,
      description,
      user: req.user.id,
    });
    await newProject.save();

    // Log activity
    await new Activity({
      user: req.user.id,
      action: "Created project",
      details: `Project "${name}" created`,
    }).save();

    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();

    // Log activity
    await new Activity({
      user: req.user.id,
      action: "Updated project",
      details: `Project "${name}" updated`,
    }).save();

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    await project.remove();

    // Log activity
    await new Activity({
      user: req.user.id,
      action: "Deleted project",
      details: `Project "${project.name}" deleted`,
    }).save();

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
