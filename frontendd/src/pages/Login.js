import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'; // Ensure this file is imported
import logimg from '../assets/grantlog.png';
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const [otpLoading, setOtpLoading] = useState(false); // Track OTP request loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userDob", data.dob);
        localStorage.setItem("userEmail", data.email);

        onLogin();
        navigate("/");  // Redirect to homepage or profile after successful login
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after request
    }
  };

  // Handle OTP request for password reset
  const handleForgotPassword = async () => {
    setOtpLoading(true); // Set OTP loading to true
    try {
      const response = await fetch("http://localhost:8081/api/auth/getOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "forgot-password" }),
      });
      const data = await response.json();
      if (data.success) {
        alert("OTP sent to email.");
      } else {
        alert("Failed to send OTP.");
      }
    } catch (error) {
      alert("Failed to send OTP.");
    } finally {
      setOtpLoading(false); // Reset OTP loading state after request
    }
  };

  // Handle password reset
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting password reset
    try {
      const response = await fetch("http://localhost:8081/api/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Password reset successful!");
        setIsResetPassword(false); 
      } else {
        alert(data.message || "Password reset failed.");
      }
    } catch (error) {
      alert("Failed to reset password.");
    } finally {
      setLoading(false); // Reset loading state after request
    }
  };

  return (
    
    <div id="unique-login-page-id"> {/* Add unique ID here */}
<div className="context">
   {/* <h2>{isResetPassword ? "Reset Password" : "Login"}</h2> */}
   <section className="ava">
        <img src={logimg} alt="avatar"></img>
        <div className="ho">
          <div className="cont">
          <center><h2>Grants</h2></center>
          <center>Hey There! Welcome to the grant Portal</center>
          </div>
      <form onSubmit={isResetPassword ? resetPassword : handleLogin}>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {isResetPassword ? (
          <>
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              disabled={otpLoading} // Disable button during OTP request
            >
              {otpLoading ? "Sending OTP..." : "Get OTP"}
            </button>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>Reset Password</button>
          </>
        ) : (
          <>
         
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="sub">Login</button>
          </>
        )}
        <div className="action-links">
          <button type="button" onClick={() => setIsResetPassword(!isResetPassword)}>
            {isResetPassword ? "Back to Login" : "Forgot Password?"}
          </button>
          <button type="button" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </form>
      </div>
      </section>
</div>


<div className="area" >
            <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    </div >
     
    </div>
  );
}

export default Login;
