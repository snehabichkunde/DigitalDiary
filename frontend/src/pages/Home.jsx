import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

const Home = () => {
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStories, setFilteredStories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [dateFilterVisible, setDateFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchStories = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/story/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStories(response.data);
        setFilteredStories(response.data); // Initially, show all stories
      } catch (error) {
        console.error("Error fetching stories:", error.response?.data || error.message);
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

  const handleDateSelect = (date) => {
    if (!startDate) {
      setStartDate(date);
    } else if (!endDate && new Date(date) >= new Date(startDate)) {
      setEndDate(date);
      setDateFilterVisible(false); // Hide the calendar after both dates are selected
      applyDateFilter(startDate, date); // Apply the date filter
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
    setFilteredStories(stories); // Reset the filtered stories to show all
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url('/index_page.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "0px",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#001a33",
        minHeight: "100vh",
      }}
    >
      <NavBar />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start", // Align content to the top
          flex: 1,
          width: "100%",
          paddingTop: "30px", // Add space above the content
          paddingBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "#001a33",
            marginBottom: "20px",
          }}
        >
          Your Index
        </h2>
        {/* Search, Sort, and Date Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            maxWidth: "1000px",
            marginBottom: "20px",
          }}
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for the story"
            value={searchQuery}
            onChange={handleSearch}
            style={{
              flex: 1,
              padding: "8px",
              fontSize: "1rem",
              fontFamily: "Georgia, 'Times New Roman', serif",
              backgroundColor: "transparent",
              border: "1px solid #001a33",
              color: "#001a33",
              outline: "none",
              marginRight: "10px",
            }}
          />

          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "1rem",
              fontFamily: "Georgia, 'Times New Roman', serif",
              border: "1px solid #001a33",
              color: "#001a33",
              backgroundColor: "transparent",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <option value="latest">Latest to Oldest</option>
            <option value="oldest">Oldest to Latest</option>
          </select>

          {/* Date Filter */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDateFilterVisible(!dateFilterVisible)}
              style={{
                padding: "8px 12px",
                fontSize: "1rem",
                fontFamily: "Georgia, 'Times New Roman', serif",
                border: "1px solid #001a33",
                color: "#001a33",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
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

            {/* Date Picker */}
            {dateFilterVisible && (
              <input
                type="date"
                min={startDate} // Restrict end date to be after start date
                max={endDate || undefined} // If end date exists, restrict start date to before it
                onChange={(e) => handleDateSelect(e.target.value)}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  padding: "8px",
                  fontSize: "1rem",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  border: "1px solid #001a33",
                  color: "#001a33",
                  backgroundColor: "#fff",
                  zIndex: 10,
                }}
              />
            )}
          </div>
        </div>

        {/* Stories Display */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "90%",
            maxWidth: "1000px",
          }}
        >
          {filteredStories.map((story) => (
            <p
              key={story.id}
              style={{
                margin: "5px 0",
                fontSize: "1rem",
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "#001a33",
              }}
            >
              {new Date(story.createdAt).toLocaleDateString()}: {story.title}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
