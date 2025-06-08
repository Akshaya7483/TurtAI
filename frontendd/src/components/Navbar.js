import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Navbar.css';
import TurtleAnimation from './TurtleAnimation'; // Import TurtleAnimation

function Navbar({ onLogout }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotificationStatus = async () => {
      if (!userId) {
        console.error("User ID is not available.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/api/notifications/status/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Notification status fetched:", data);  // Log the fetched status
        if (data.success) {
          setNotificationsEnabled(data.notificationsEnabled);
        } else {
          console.error("Failed to fetch notification status");
        }
      } catch (error) {
        console.error("Error fetching notification status", error);
      }
    };
    fetchNotificationStatus();
  }, [userId]);

  const handleNotificationToggle = async () => {
    setLoading(true); // Set loading to true when the button is clicked
    try {
      const response = await fetch("http://localhost:8081/api/notifications/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, enabled: !notificationsEnabled }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from toggle:", data); // Log the response

      if (data.success) {
        setNotificationsEnabled(!notificationsEnabled); // Toggle the state if successful
      } else {
        alert("Failed to update notification status");
      }
    } catch (error) {
      console.error("Error toggling notifications", error);
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  return (
    <>
    <nav id="navbar-unique" className="navbar">
      <h2 id="navbar-title-unique">Turt-AI ✨</h2>
      <ul id="nav-links-unique" className="nav-links">
        <li><Link to="/" id="home-link-unique">Home</Link></li>
        <li><Link to="/grants" id="grants-link-unique">Available Grants</Link></li>
        <li><Link to="/grant-templates" id="templates-link-unique">Grant Templates</Link></li>
        <li><Link to="/grantai" id="grantai-link-unique">GrantAI</Link></li>
        <li><Link to="/history" id="history-link-unique">History</Link></li>
        <li><Link to="/profile" id="profile-link-unique">Profile</Link></li>
     
      </ul>
     
          <button 
            onClick={handleNotificationToggle} 
            id="notification-toggle-btn" 
            disabled={loading} // Disable button while loading
          >
            <i className={`fas ${notificationsEnabled ? 'fa-bell' : 'fa-bell-slash'}bell-icon`}></i> 
            {loading ? " " : (notificationsEnabled ? "🔔" : "🕭")}
          </button>
      
      <button onClick={onLogout} id="logout-btn-unique">Logout</button>
    </nav>
     <TurtleAnimation />
     </>
  );
}

export default Navbar;
