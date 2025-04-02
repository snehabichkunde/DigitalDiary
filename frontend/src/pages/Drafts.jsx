import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./Home.css"; 

const Draft = () => {
    const [drafts, setDrafts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDrafts, setFilteredDrafts] = useState([]);
    const [sortOrder, setSortOrder] = useState("");
    const [dateFilterVisible, setDateFilterVisible] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [allTags, setAllTags] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDrafts = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }
            try {
                const response = await axios.get("https://digitaldiary-vkw0.onrender.com/api/story/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const draftStories = response.data.filter((story) => story.isDraft === true);
                const sortedDrafts = draftStories.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setDrafts(sortedDrafts);
                setFilteredDrafts(sortedDrafts);
                const tags = new Set();
                sortedDrafts.forEach((story) =>
                    Object.keys(story)
                        .filter((key) => key.startsWith("is") && story[key])
                        .forEach((key) => tags.add(key))
                );
                setAllTags(Array.from(tags));
            } catch (error) {
                console.error("Error fetching drafts:", error.response?.data || error.message);
            }
        };
        fetchDrafts();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = drafts.filter((draft) =>
            draft.title.toLowerCase().includes(query)
        );
        setFilteredDrafts(filtered);
    };

    const handleSortChange = (sortOption) => {
        setSortOrder(sortOption);
        const sortedDrafts = [...filteredDrafts].sort((a, b) => {
            if (sortOption === "latest") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortOption === "oldest") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            return 0;
        });
        setFilteredDrafts(sortedDrafts);
    };

    const handleTagSelect = (e) => {
        const selected = e.target.value;
        setSelectedTag(selected);
        if (!selected) {
            setFilteredDrafts(drafts);
            return;
        }
        const filtered = drafts.filter((draft) => draft[selected] === true);
        setFilteredDrafts(filtered);
    };

    const handleDateSelect = (date) => {
        if (!startDate) {
            setStartDate(date);
        } else if (!endDate && new Date(date) >= new Date(startDate)) {
            setEndDate(date);
            setDateFilterVisible(false);
            applyDateFilter(startDate, date);
        }
    };

    const applyDateFilter = (start, end) => {
        if (start && end) {
            const filteredByDate = drafts.filter((draft) => {
                const draftDate = new Date(draft.createdAt);
                const startDateObj = new Date(start);
                const endDateObj = new Date(end);
                return draftDate >= startDateObj && draftDate <= endDateObj;
            });
            setFilteredDrafts(filteredByDate);
        }
    };

    const resetDateFilter = () => {
        setStartDate("");
        setEndDate("");
        setFilteredDrafts(drafts);
    };

    return (
        <div className="home-container">
            <div className="home-sidebar">
                <NavBar />
            </div>
            <div className="home-content">
                <div className="home-header">
                    <h2 className="home-h2">Your Drafts</h2>
                    <div className="home-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search for the draft"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="home-input"
                        />
                        <select
                            value={selectedTag}
                            onChange={handleTagSelect}
                            className="home-select"
                        >
                            <option value="">Filter by tag</option>
                            {allTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag.replace("is", "")}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="home-select"
                        >
                            <option value="latest">Latest to Oldest</option>
                            <option value="oldest">Oldest to Latest</option>
                        </select>
                        <div className="home-date-picker">
                            <button
                                onClick={() => setDateFilterVisible(!dateFilterVisible)}
                                className="home-date-button"
                            >
                                {startDate && endDate
                                    ? `Start: ${startDate} -> End: ${endDate}`
                                    : "Start Date -> End Date"}
                                {startDate && endDate && (
                                    <span onClick={resetDateFilter} className="home-reset-date">
                                        ×
                                    </span>
                                )}
                            </button>
                            {dateFilterVisible && (
                                <input
                                    type="date"
                                    min={startDate}
                                    max={endDate || undefined}
                                    onChange={(e) => handleDateSelect(e.target.value)}
                                    className="home-date-input"
                                />
                            )}
                        </div>
                    </div>
                    <div className="home-list-wrapper">
                        <DraftList drafts={filteredDrafts} navigate={navigate} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DraftList = ({ drafts, navigate }) => (
    <ul className="home-story-list">
        {drafts.map((draft) => (
            <li
                key={draft._id}
                className="home-list-item"
                onClick={() => navigate(`/story/${draft._id}`)}
            >
                {new Date(draft.createdAt).toLocaleDateString("en-US")} : {draft.title}
            </li>
        ))}
    </ul>
);

export default Draft;