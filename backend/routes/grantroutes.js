const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Route to record a grant click
router.post("/record-grant-click", (req, res) => {
    const { user_id, grant_id } = req.body;
    console.log(grant_id)
    if (!user_id || !grant_id) {
        return res.status(400).json({ error: "Missing user_id or grant_id" });
    }

    const currentTime = new Date().toISOString();

    db.run(
        "INSERT INTO user_grant_history (user_id, grant_id, clicked_at) VALUES (?, ?, ?)",
        [user_id, grant_id, currentTime],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Failed to record grant click" });
            }
            res.status(200).json({ message: "Click recorded successfully" });
        }
    );
});

// Route to get all grants
router.get("/grants", (req, res) => {
    db.all("SELECT * FROM grants", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch grants" });
        }
        res.status(200).json(rows);
    });
});

// Route to get a single grant by ID
router.get("/grants/:id", (req, res) => {
    const grantId = req.params.id;

    db.get("SELECT * FROM grants WHERE id = ?", [grantId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch grant" });
        }
        if (!row) {
            return res.status(404).json({ error: "Grant not found" });
        }
        res.status(200).json(row);
    });
});
// Route to get user's grant history
router.get("/user-grant-history/:user_id", (req, res) => {
    const userId = req.params.user_id;

    db.all(
        `SELECT grants.title, grants.organization, grants.grant_amount, grants.deadline, user_grant_history.clicked_at 
        FROM user_grant_history 
        JOIN grants ON user_grant_history.grant_id = grants.id 
        WHERE user_grant_history.user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch grant history' });
            }
            res.status(200).json(rows);
        }
    );
});

module.exports = router;
