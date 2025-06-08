import { useState } from "react";
// import '../styles/Navbar.css';
function NotificationToggle({ userId }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const toggleNotifications = async () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          enabled: newStatus,
        }),
      });
      const result = await response.json();
      console.log(result.message); // Optional: Show success message or notification
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  return (
    <button onClick={toggleNotifications}>
         
      {notificationsEnabled ? "disabled" : "enabled"}
    </button>
  );
}

export default NotificationToggle;
