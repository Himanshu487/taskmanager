const Activity = require("../models/Activity");

// Get all activities for a user
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new activity (internal use, not exposed via API)
exports.createActivity = async (userId, action, details) => {
  try {
    const newActivity = new Activity({
      user: userId,
      action,
      details,
    });
    await newActivity.save();
    return newActivity;
  } catch (err) {
    console.error("Error creating activity:", err);
  }
};
