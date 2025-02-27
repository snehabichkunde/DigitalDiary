import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import styles from "../styles";

const Home = () => {
    const [stories, setStories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStories, setFilteredStories] = useState([]);
    const [sortOrder, setSortOrder] = useState("");
    const [dateFilterVisible, setDateFilterVisible] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [allTags, setAllTags] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }

            try {
                const response = await axios.get("https://digitaldiary-vkw0.onrender.com/api/story/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const nonDraftStories = response.data.filter(
                    (story) => story.isDraft === false
                );

                const sortedStories = nonDraftStories.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setStories(sortedStories);
                setFilteredStories(sortedStories);
                const tags = new Set();
                sortedStories.forEach((story) => {
                    Object.keys(story)
                        .filter((key) => key.startsWith("is") && story[key])
                        .forEach((key) => tags.add(key));
                });
                setAllTags(Array.from(tags));

            } catch (error) {
                console.error(
                    "Error fetching stories:",
                    error.response?.data || error.message
                );
            }
        };

        fetchStories();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = stories.filter((story) =>
            story.title.toLowerCase().includes(query)
        );
        setFilteredStories(filtered);
    };

    const handleSortChange = (sortOption) => {
        setSortOrder(sortOption);

        const sortedStories = [...filteredStories].sort((a, b) => {
            if (sortOption === "latest") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortOption === "oldest") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            return 0;
        });

        setFilteredStories(sortedStories);
    };

    const handleTagSelect = (e) => {
        const selected = e.target.value;
        setSelectedTag(selected);

        if (!selected) {
            setFilteredStories(stories);
            return;
        }

        const filtered = stories.filter((story) => story[selected] === true);
        setFilteredStories(filtered);
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
            const filteredByDate = stories.filter((story) => {
                const storyDate = new Date(story.createdAt);
                const startDateObj = new Date(start);
                const endDateObj = new Date(end);

                return storyDate >= startDateObj && storyDate <= endDateObj;
            });

            setFilteredStories(filteredByDate);
        }
    };

    const resetDateFilter = () => {
        setStartDate("");
        setEndDate("");
        setFilteredStories(stories);
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <NavBar />
            </div>

            <div style={styles.content}>
                <div style={styles.header}>
                    <h2 style={styles.h2}>Your Index</h2>

                    <div style={styles.inputWrapper}>
                        <input
                            type="text"
                            placeholder="Search for the story"
                            value={searchQuery}
                            onChange={handleSearch}
                            style={styles.input}
                        />
                        <select
                            value={selectedTag}
                            onChange={handleTagSelect}
                            style={styles.select}
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
                            style={styles.select}
                        >
                            <option value="latest">Latest to Oldest</option>
                            <option value="oldest">Oldest to Latest</option>
                        </select>

                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setDateFilterVisible(!dateFilterVisible)}
                                style={styles.dateButton}
                            >
                                {startDate && endDate
                                    ? `Start: ${startDate} -> End: ${endDate}`
                                    : "Start Date -> End Date"}
                                {startDate && endDate && (
                                    <span
                                        onClick={resetDateFilter}
                                        style={{
                                            marginLeft: "10px",
                                            color: "#001a33",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                        }}
                                    >
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
                                    style={styles.dateInput}
                                />
                            )}
                        </div>
                    </div>

                    <div style={styles.listWrapper}>
                        <StoryList stories={filteredStories} navigate={navigate} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StoryList = ({ stories, navigate }) => (
    <ul style={{ listStyleType: "none", padding: 0 }}>
        {stories.map((story) => (
            <li
                key={story._id}
                style={styles.listItem}
                onClick={() => navigate(`/story/${story._id}`)}
            >
                {new Date(story.createdAt).toLocaleDateString("en-US")} : {story.title}
            </li>
        ))}
    </ul>
);

export default Home;
