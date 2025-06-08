const db = require('../database/db');

// Toggle notification status
const toggleNotification = (req, res) => {
    const { userId, enabled } = req.body;
    const notificationStatus = enabled ? true : false; // Use true/false for BOOLEAN type

    const query = "UPDATE users SET notifications = ? WHERE id = ?";
    db.run(query, [notificationStatus, userId], function (err) {
        if (err) {
            console.error("Error updating notification status:", err.message);
            return res.status(500).json({ success: false, error: "Failed to update notification status", details: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success: false, error: "User not found or no changes made" });
        }

        res.json({ 
            success: true,
            message: `Notifications ${enabled ? "🔕" : "🔔"}`
        });
    });
};

module.exports = { toggleNotification };
