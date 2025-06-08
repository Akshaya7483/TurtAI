import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../styles/auth.css'; // Import the CSS file here

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    otp: '',
    dob: '',
    confirmPassword: '',
    userType: ''
  });
  const navigate = useNavigate();

  const toggleAuth = () => setIsLogin(!isLogin);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin ? 'http://localhost:8081/auth/login' : 'http://localhost:8081/auth/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (data.success) {
        alert(isLogin ? 'Login successful!' : 'Registration successful!');
        if (isLogin) {
          onLogin();
          navigate('/');
        } else {
          setIsLogin(true); // Switch to login after registration
        }
      } else {
        alert(data.message || 'An error occurred.');
      }
    } catch (error) {
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? 'slide-in' : 'slide-out'}`}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleAuth}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={form.dob}
                onChange={handleInputChange}
                required
              />
              <select name="userType" value={form.userType} onChange={handleInputChange} required>
                <option value="">Select User Type</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
          {isLogin ? (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              required
            />
          ) : (
            <>
              <button type="button" onClick={() => {/* handle OTP logic */}}>Get OTP</button>
              <input
                type="text"
                name="otp"
                placeholder="OTP"
                value={form.otp}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
          <button type="button" onClick={toggleAuth} className="toggle-link">
            {isLogin ? 'New here? Register' : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
