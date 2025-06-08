import React, { useEffect, useState } from "react";
import { getGrants, recordGrantClick } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Grants.css";

function Grants() {
    const [grants, setGrants] = useState([]);
    const [filteredGrants, setFilteredGrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // for search input
    const [filters, setFilters] = useState({
        deadline: "",
        organization: "",
    });
    const navigate = useNavigate();

    // Fetch grants data on initial load
    useEffect(() => {
        const fetchGrantsData = async () => {
            try {
                const response = await getGrants();
                setGrants(response.data);
                setFilteredGrants(response.data); // Initially show all grants
                console.log("Fetched grants data:", response.data);
            } catch (error) {
                console.error("Error fetching grants data:", error);
                setError("Failed to fetch grants data.");
            } finally {
                setLoading(false);
            }
        };

        fetchGrantsData();
    }, []);

    // Handle search term input and filter grants by title
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchTerm(query);
        filterGrants(query, filters);
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        filterGrants(searchTerm, { ...filters, [name]: value });
    };

    // Filter grants based on search term and filters
    const filterGrants = (searchTerm, filters) => {
        let filtered = grants.filter((grant) =>
            grant.title.toLowerCase().includes(searchTerm)
        );

        if (filters.deadline) {
            const today = new Date();
            filtered = filtered.filter((grant) => {
                const grantDeadline = new Date(grant.deadline);
                return (
                    (filters.deadline === "upcoming" &&
                        grantDeadline >= today) ||
                    (filters.deadline === "past" && grantDeadline < today)
                );
            });
        }

        if (filters.organization) {
            filtered = filtered.filter((grant) =>
                grant.organization.toLowerCase().includes(filters.organization.toLowerCase())
            );
        }

        setFilteredGrants(filtered); // Update the filtered grants state
    };

    // Handle when a grant is clicked
    const handleGrantClick = async (grantId) => {
        const userId = localStorage.getItem("userId"); // Assuming user ID is in localStorage
        if (!userId) {
            alert("User not logged in!");
            return;
        }

        try {
            await recordGrantClick(userId, grantId); // Record the click in the backend
            console.log("Grant click recorded", userId);
            navigate(`/grant-details/${grantId}`); // Navigate to the grant details page
        } catch (error) {
            console.error("Error recording grant click:", error);
        }
    };

    if (loading) return <p>Loading grants...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="grants-container">
            <h1>Available Grants</h1>

            {/* Search Bar */}
            <div className="fil">
            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by Grant Title"
                    className="search-input"
                />
            </div>

            {/* Filter Section */}
            <div className="filter-container">
                <div className="filter-item">
                    <label>Deadline:</label>
                    <select
                        name="deadline"
                        value={filters.deadline}
                        onChange={handleFilterChange}
                    >
                        <option value="">Any</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>Organization:</label>
                    <input
                        type="text"
                        name="organization"
                        value={filters.organization}
                        onChange={handleFilterChange}
                        placeholder="Organization"
                    />
                </div>
            </div>
</div>
           
            <ul className="grant-list">
                {filteredGrants.map((grant, index) => (
                    <li key={index} className="grant-item">
                        <h3>{grant.title}</h3>
                        <p><strong>Organization:</strong> {grant.organization}</p>
                        <p><strong>Grant Amount:</strong> {grant.grant_amount}</p>
                        <p><strong>Deadline:</strong> {grant.deadline}</p>
                        <button
                            className="apply-button"
                            onClick={() => {
                                handleGrantClick(grant.id);
                                // Open the grant link in a new tab if it exists
                                if (grant.link) {
                                    window.open(grant.link, "_blank");
                                } else {
                                    alert("Grant link not available.");
                                }
                            }}
                        >
                            Apply Now
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Grants;
