// src/pages/HistoryTracking.js
import React, { useEffect, useState } from "react";
import { getGrantHistory } from "../services/api"; // Service function to fetch history
import "../styles/history.css";

function HistoryTracking() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGrantHistory = async () => {
            const userId = localStorage.getItem("userId"); 
            if (!userId) {
                setError("User not logged in!");
                setLoading(false);
                return;
            }

            try {
                const response = await getGrantHistory(userId); // API call to get grant history
                setHistory(response.data);
            } catch (error) {
                setError("Failed to fetch grant history.");
            } finally {
                setLoading(false);
            }
        };

        fetchGrantHistory();
    }, []);

    if (loading) return <p className="grant-history-loading">Loading grant history...</p>;
    if (error) return <p className="grant-history-error">{error}</p>;

    return (
        <div id="grant-history-container">
            
            <h1 id="grant-history-title">Your Grant History</h1>
            <ul id="grant-history-list">
                {history.map((item) => (
                    <li key={`${item.title}-${item.clicked_at}`} className="grant-history-item">
                        <p><strong>Grant Title:</strong> {item.title}</p>
                        <p><strong>Organization:</strong> {item.organization}</p>
                        <p><strong>Grant Amount:</strong> {item.grant_amount}</p>
                        <p><strong>Deadline:</strong> {item.deadline}</p>
                        <p><strong>Clicked at:</strong> {new Date(item.clicked_at).toLocaleString('en-GB')}</p>
                    </li>
                ))}
            </ul>
            
        </div>
    );
}

export default HistoryTracking;
