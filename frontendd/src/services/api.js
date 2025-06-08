// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081", // Update with your backend URL if different
});

// Auth API
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const getOtp = (data) => api.post("/auth/get-otp", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);

// Chat API
export const createChatSession = (data) => api.post("/chat/new", data);
export const getChatHistory = (sessionId) => api.get(`/chat/${sessionId}/history`);
export const sendMessage = (sessionId, data) => api.post(`/chat/${sessionId}/message`, data);
export const getGrants = () => api.get("/api/announcements");

export const getGrantHistory = async (userId) => {
  try {
      // Replace with your actual API endpoint
      const response = await axios.get(`http://localhost:8081/api/user-grant-history/${userId}`);
      console.log(response.data);
      return response;
      
        // The response data will be in response.data
  } catch (error) {
      console.error("Error fetching grant history:", error);
      throw error;  // Throwing the error so it can be caught in the component
  }
};

export const recordGrantClick = (userId, grantId) => {
    return axios.post("http://localhost:8081/api/record-grant-click", { user_id: userId, grant_id: grantId });
};

export const saveGrantClick = (userId, grantId) => api.post("http://localhost:8081/api/grant-history", { userId, grantId });
export const getGrantDetails = async (grantId) => {
  const response = await axios.get(`/api/grants/${grantId}`);
  return response;
};
export const toggleNotification = (userId, enabled) => {
  return api.post("http://localhost:8081/api/notifications/toggle", { userId, enabled });
};
export const fetchNotificationStatus = (userId) =>
  api.get(`/api/notifications/status/${userId}`);

export const getUploadedFiles = async () => {
  try {
    // Make sure this URL points to the backend server (http://localhost:8081)
    const response = await axios.get("http://localhost:8081/api/uploads"); // Correct URL
    return response.data; // Return the list of files (array of file names)
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    throw error; // Throw error to handle it in the component
  }
};

export default api;
