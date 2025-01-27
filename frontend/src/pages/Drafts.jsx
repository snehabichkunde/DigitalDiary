import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDrafts, setFilteredDrafts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [dateFilterVisible, setDateFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
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

        const draftEntries = response.data.filter((story) => story.isDraft === true);

        const sortedDrafts = draftEntries.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setDrafts(sortedDrafts);
        setFilteredDrafts(sortedDrafts);
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
    setFilteredDrafts(drafts); // Reset the filtered drafts to show all
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row", // Keep the navbar and main content side by side
        minHeight: "100vh", // Full height
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "250px", // Sidebar width
          flexShrink: 0, // Prevent shrinking
        }}
      >
        <NavBar />
      </div>

      <div
        style={{
          flex: 1, // Take up remaining space
          display: "flex",
          flexDirection: "column",
          backgroundImage: "url('/index_page.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "0px",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#001a33",
          overflowY: "auto", // Allow scrolling if content exceeds the screen height
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            flex: 1,
            width: "100%",
            paddingTop: "30px",
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
            Your Drafts
          </h2>

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
            <input
              type="text"
              placeholder="Search for drafts"
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

              {dateFilterVisible && (
                <input
                  type="date"
                  min={startDate}
                  max={endDate || undefined}
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
            <DraftList drafts={filteredDrafts} navigate={navigate} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DraftList = ({ drafts, navigate }) => (
  <ul style={{ listStyleType: "none", padding: 0 }}>
    {drafts.map((draft) => (
      <li
        key={draft._id}
        style={{
          padding: "5px",
          margin: "3px 0",
          fontSize: "1.2rem",
          color: "#001a33",
          cursor: "pointer",
          transition: "transform 0.2s ease",
          textDecoration: "underline",
        }}
        onClick={() => navigate(`/story/${draft._id}`)}
      >
        {new Date(draft.createdAt).toLocaleDateString("en-US")} : {draft.title}
      </li>
    ))}
  </ul>
);

export default Drafts;
