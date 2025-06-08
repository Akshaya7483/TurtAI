import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GrantDetails = () => {
    const { grantId } = useParams();
    const [grantDetails, setGrantDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGrantDetails();
    }, [grantId]);

    const fetchGrantDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/grants/${grantId}`);
            const data = await response.json();
            setGrantDetails(data);
        } catch (error) {
            console.error("Error fetching grant details:", error);
            setError("Failed to fetch grant details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{grantDetails.name}</h1>
            <p>{grantDetails.description}</p>
        </div>
    );
};

export default GrantDetails;
