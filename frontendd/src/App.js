// src/App.js


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import GrantAI from './pages/GrantAI';
import GrantTemplates from './pages/GrantTemplates';
import HistoryTracking from './pages/HistoryTracking';
import Profile from './pages/Profile';
import Grants from './pages/Grants';
import StudentLogin from './pages/StudentLogin'; // Import StudentLogin
import FacultyLogin from './pages/FacultyLogin'; // Import FacultyLogin
import Library from './pages/Library';
import FileUploadButton from './components/FileUploadButton';
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("userId")
    );
    const [userType, setUserType] = useState(localStorage.getItem("userType")); // Track user type

    const handleLogin = (type) => {
        setIsAuthenticated(true);
        setUserType(type); // Store user type on login
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userType");
        setIsAuthenticated(false);
        setUserType(null);
    };
    console.log(userType)
    return (
        <Router>
            <div>
                {isAuthenticated && <Navbar onLogout={handleLogout} />}
                <Routes>
                    {/* Main Route */}
                    <Route path="/" element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} />

                    {/* Login Routes */}
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/student-login" element={<StudentLogin onLogin={() => handleLogin("student")} />} />
                    <Route path="/faculty-login" element={<FacultyLogin onLogin={() => handleLogin("faculty")} />} />

                    {/* Register Route */}
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/grant-templates" element={<GrantTemplates />} /> {/* Corrected route for Grant Templates */}
                    <Route path="/grantai" element={isAuthenticated ? <GrantAI /> : <Navigate to="/login" />} />
                    <Route path="/history" element={isAuthenticated ? <HistoryTracking /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/grants" element={isAuthenticated ? <Grants /> : <Navigate to="/login" />} />
                    <Route path="/FileUploadButton" element={<FileUploadButton />} />
                    <Route path="/Library" element={<Library />} />
                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
