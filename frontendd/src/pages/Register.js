import React, { useState } from "react";
import '../styles/Register.css';
 import regimg from '../assets/reg.png'
function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    otp: "",
    dob: "",
    password: "",
    confirmPassword: "",
    userType: "", // new field
  });

  const handleGetOtp = async () => {
    try {
      const response = await fetch("http://localhost:8081/auth/get-otp", {  // Updated route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, type: "register" }),
      });
      const data = await response.json();
      if (data.success) {
        alert("OTP sent to email.");
      } else {
        alert("Failed to send OTP.");
      }
    } catch (error) {
      alert("Failed to send OTP.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate the form data
    if (!form.name || !form.email || !form.dob || !form.password || !form.confirmPassword || !form.otp) {
      alert("All fields are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Registration failed.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div id="register-container-unique">
      
      <section className="reg">
        <div className="im">
          <img src={regimg} alt="avatar"></img>
        </div>
        <div className="ffield">
          <h1>Register</h1>
          <p>Welcome to Grants Your Journey Starts Here</p>
    <form onSubmit={handleRegister} id="register-form-unique">
    

<div className="form-row">
  <input
    type="text"
    name="name"
    value={form.name}
    onChange={handleChange}
    id="name-input-unique"
    placeholder="Name"
    required
  />
</div>

<div className="form-row">
  <input
    type="email"
    name="email"
    value={form.email}
    onChange={handleChange}
    id="email-input-unique"
    placeholder="Email"
    required
  />
</div>

      <div className="form-row" id="otp-row-unique">
        <input type="text" name="otp" value={form.otp} onChange={handleChange} id="otp-input-unique" placeholder="Enter OTP" required />
        <button type="button" className="otp-button" onClick={handleGetOtp} id="get-otp-btn-unique">Get OTP</button>
      </div>

      <div className="form-row" id="dob-userType-row-unique">
        <input type="date" name="dob" value={form.dob} onChange={handleChange} id="dob-input-unique" placeholder="Date of Birth" required />
        <select name="userType" value={form.userType} onChange={handleChange} id="user-type-select-unique" required>
          <option value="">Select User Type</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
      </div>

      <div className="form-row" id="password-row-unique">
        <input type="password" name="password" value={form.password} onChange={handleChange} id="password-input-unique" placeholder="Password" required />
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} id="confirm-password-input-unique" placeholder="Confirm Password" required />
      </div>

      <div className="form-row" id="register-btn-row-unique">
        <button type="submit" className="register-submit" id="register-submit-btn-unique">Register</button>
       
      <button type="button" className="back-to-login-btn" onClick={() => window.location.href = "/login"}>
      ➤
        </button>
  </div>
    </form>
    </div>
    </section>
    </div>
  );
}

export default Register;
