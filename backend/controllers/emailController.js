const { exec } = require("child_process");

exports.sendOtpEmail = (email, otp, res) => {
    console.log(`Sending OTP to email: ${email}`);

    exec(`python3 ./utils/send_email.py ${email} ${otp}`, (error, stdout, stderr) => {
        if (error) {
            console.error("Error sending OTP email:", error.message);
            console.error(stderr);
            return res.status(500).json({ success: false, message: "Failed to send OTP email" });
        } else {
            console.log("OTP email sent:", stdout);
            res.json({ success: true, message: "OTP sent to your email" });
        }
    });
};
