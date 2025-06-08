import React, { useEffect, useState } from "react";
import { getUploadedFiles } from "../services/api"; // Import API function for fetching files

const Library = () => {
  const [files, setFiles] = useState([]); // State to store files
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await getUploadedFiles(); // Fetch uploaded files using API
        setFiles(files); // Update state with fetched files
      } catch (error) {
        console.error("Error fetching uploaded files:", error);
        alert("Failed to fetch uploaded files.");
      } finally {
        setLoading(false); // Turn off loading indicator
      }
    };

    fetchFiles();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Library</h2>
      {loading ? (
        <p>Loading...</p> // Show loading message while fetching files
      ) : files.length === 0 ? (
        <p>No files uploaded yet.</p> // Show message if no files are available
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a
                href={`http://localhost:8081/uploads/${file}`} // Link to the uploaded file
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007BFF", textDecoration: "none" }}
              >
                {file}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Library;
