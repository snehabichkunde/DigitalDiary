import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

const Home = () => {
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStories, setFilteredStories] = useState([]);

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

    // Filter stories based on the search query
    const filtered = stories.filter((story) =>
      story.title.toLowerCase().includes(query)
    );
    setFilteredStories(filtered);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Ensure it takes full height
        backgroundImage:
          "linear-gradient(white 50px, transparent 0), linear-gradient(to right, white 50px, transparent 0)",
        backgroundSize: "100% 60px, 60px 100%",
        backgroundColor: "#fdf4dc",
        padding: "20px",
        fontFamily: "Georgia, 'Times New Roman', serif", // Consistent elegant font
      }}
    >
      <NavBar />
      
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%", // Ensures the container takes full width
        }}
      >
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: "100%", // Make search bar span the entire width
            maxWidth: "1000px", // Add a max-width if you want to limit the width
            padding: "12px",
            fontSize: "1.2rem",
            border: "1px solid #c5a880",
            borderRadius: "5px",
            marginBottom: "20px",
            fontFamily: "Georgia, 'Times New Roman', serif", // Consistent elegant font
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "#6d4c41",
            textAlign: "center",
          }}
        />
        
        {/* Story List */}
        <div
          style={{
            width: "100%", // Full width container
            maxWidth: "1000px", // Add max-width to contain content
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            fontFamily: "Georgia, 'Times New Roman', serif", // Consistent elegant font
            color: "#6d4c41",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Your Diary Index
          </h2>
          {filteredStories.length === 0 ? (
            <p style={{ textAlign: "center" }}>No matching entries found.</p>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {filteredStories.map((story) => (
                <li
                  key={story._id}
                  style={{
                    padding: "12px",
                    margin: "10px 0",
                    border: "1px solid #c5a880",
                    borderRadius: "5px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    fontSize: "1.2rem",
                    color: "#6d4c41",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onClick={() => alert(`Story ID: ${story._id}`)} // Replace with actual navigation
                >
                  {story.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
