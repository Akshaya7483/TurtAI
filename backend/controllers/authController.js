const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const db = require("../database/db");
const emailController = require("./emailController");
const fs = require("fs");

// Register userconst fs = require("fs");
const path = require("path");
const CHAT_JSON_PATH = path.join(__dirname, ".../chat.json");

// Generate OTP
function generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp); // Log the OTP for debugging
    return otp;
}



exports.register = async (req, res) => {
    const { name, email, otp, dob, password, userType } = req.body; // add userType
    const userId = uuidv4();


    console.log(`Received registration request for email: ${email}`);

    // Verify OTP before registration
    const otpQuery = `SELECT * FROM otp_requests WHERE email = ? AND otp = ?`;
    db.get(otpQuery, [email, otp], async (err, otpRecord) => {
        if (err) {
            console.error("Database error in OTP query:", err.message);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        if (!otpRecord) {
            console.log("Invalid OTP for email:", email);
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Hash the password
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const userQuery = `INSERT INTO users (id, name, email, password, dob, user_type) VALUES (?, ?, ?, ?, ?, ?)`; // updated
            db.run(userQuery, [userId, name, email, hashedPassword, dob, userType], function (err) { // updated
                if (err) {
                    console.error("Error during user registration:", err.message);
                    return res.status(500).json({ success: false, message: "User already exists or registration failed" });
                }

                // After successful registration, append user to chat.json
                // updateChatJsonWithUser(userId);

                res.json({ success: true, message: "Registration successful" });
            });
        } catch (error) {
            console.error("Password hashing error:", error.message);
            return res.status(500).json({ success: false, message: "Password hashing failed" });
        }
    });
};

// Function to initialize or update chat.json with the new user ID
function updateChatJsonWithUser(userId) {
    try {
        // Load existing chat data or initialize an empty object
        let chatData = {};
        if (fs.existsSync(CHAT_JSON_PATH)) {
            const rawData = fs.readFileSync(CHAT_JSON_PATH);
            chatData = JSON.parse(rawData);
        }

        // Add new user data if not already present
        if (!chatData[userId]) {
            chatData[userId] = {
                sessions: {}
            };
        }

        // Write updated data back to chat.json
        fs.writeFileSync(CHAT_JSON_PATH, JSON.stringify(chatData, null, 2));
        console.log("Updated chat.json with user:", userId);
    } catch (error) {
        console.error("Error updating chat.json:", error.message);
    }
}


// Login user
exports.login = (req, res) => {
    const { email, password } = req.body;
  
    const query = `SELECT id, name, dob, email, password, user_type FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err || !user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        res.json({
            success: true,
            message: "Login successful",
            userId: user.id,
            name: user.name,
            dob: user.dob,
            email: user.email,
            userType: user.user_type  // Include userType in response
        });
    });
};
// Generate and send OTP
exports.getOtp = (req, res) => {
    const { email, type } = req.body;
    console.log("email : ",email)
    const otp = generateOtp();

    db.run(`INSERT INTO otp_requests (email, otp, created_at) VALUES (?, ?, datetime('now'))`, [email, otp], function (err) {
        if (err) {
            console.error("Failed to store OTP:", err.message);
            return res.status(500).json({ success: false, message: "Failed to store OTP" });
        }
        emailController.sendOtpEmail(email, otp, res); // Send OTP email
    });
};
