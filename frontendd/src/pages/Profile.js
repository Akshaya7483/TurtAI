import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import FileUploadButton from "../components/FileUploadButton.js";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [files, setFiles] = useState([]);
  const userId = localStorage.getItem("userId");


  // Default avatar based on the first letter of the user's name or "D" if undefined
  const defaultAvatar = () => {
    const name = localStorage.getItem("userName") || "Default";
    const initial = name.charAt(0).toUpperCase(); // Get the first letter of the name
    return `https://ui-avatars.com/api/?name=${initial}&background=random&size=128`;
  };

  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem("profilePicture") || defaultAvatar());

  useEffect(() => {
    const storedUserData = {
      fullName: localStorage.getItem("userName") || "Default User",
      email: localStorage.getItem("userEmail") || "default@example.com",
      dob: localStorage.getItem("userDob") || "Unknown",
      profilePicture: selectedAvatar,
      grantsApplied: JSON.parse(localStorage.getItem("grantsApplied") || "[]"),
    };

    setUserData(storedUserData);
  }, [selectedAvatar]);

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
    localStorage.setItem("profilePicture", avatar);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      if (!userId) {
        console.error("User ID is missing. Please log in first.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/files/${userId}`);
        if (response.ok) {
          const fileList = await response.json();
          setFiles(fileList);
        } else {
          console.error("Failed to fetch files.");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [userId]);

  if (!userData) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={selectedAvatar} alt="Profile" className="profile-picture" />
        <h2>{userData.fullName}</h2>
        <p>{userData.email}</p>
        <p>{userData.dob}</p>
      </div>
      
      <div className="profile-avatar-selection">
        <h3>Select an Avatar</h3>
        <div className="avatar-options">
          {[...Array(5)].map((_, index) => {
            const initial = userData.fullName ? userData.fullName.charAt(0).toUpperCase() : "D";
            const colors = ["0D8ABC", "FF5733", "FFC300", "DAF7A6", "581845"];
            const avatar = `https://ui-avatars.com/api/?name=${initial}&background=${colors[index]}&color=fff&size=128`;
            return (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                onClick={() => handleAvatarChange(avatar)}
              />
            );
          })}
        </div>
      </div>

      <div className="profile-grants">
        <h3>Grants Applied</h3>
        {files.length > 0 ? (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a
                href={`http://localhost:8081/uploads/${file}`}
                download
              >
                {file}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No grants applied yet.</p>
      )}
      </div>
      <div>
      <FileUploadButton />
      </div>
    </div>
  );
};

export default Profile;
