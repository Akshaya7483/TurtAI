import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FileUploadButton = () => {
  const [file, setFile] = useState(null); // State to store selected file
  const navigate = useNavigate(); // For navigation

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Update file state
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8081/api/upload-file", { // Corrected URL
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setFile(null); // Clear file selection
      } else {
        const errorData = await response.json();
        alert(`Failed to upload file: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div>
      <label
        htmlFor="fileUpload"
        style={{
          cursor: "pointer",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          display: "inline-block",
        }}
      >
        Select File
      </label>
      <input
        type="file"
        id="fileUpload"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <br />
      {file && (
        <div style={{ marginTop: "10px", fontStyle: "italic" }}>
          Selected file: {file.name}
        </div>
      )}
      <button
        onClick={handleUpload}
        style={{
          marginTop: "10px",
          padding: "10px 15px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload
      </button>
      <button
        onClick={() => navigate("/library")}
        style={{
          marginTop: "10px",
          marginLeft: "10px",
          padding: "10px 15px",
          backgroundColor: "#FFC107",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go to Library
      </button>
    </div>
  );
};

export default FileUploadButton;
