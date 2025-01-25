import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import axios from "axios";
import NavBar from "../components/NavBar";

const Home = () => {
  const [stories, setStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStories, setFilteredStories] = useState([]);
  const navigate = useNavigate();  // Initialize useNavigate

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

  const handleStoryClick = (id) => {
    navigate(`/story/${id}`);  // Navigate to story details page with the story ID
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Ensure it takes full height
        backgroundImage: `url('/index_page.jpeg')`, // Background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "0px", // Set padding to 0 to remove extra space
        fontFamily: "Georgia, 'Times New Roman', serif", // Consistent elegant font
        color: "#001a33", // Dark blue color
      }}
    >
      <NavBar />
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center the content
          justifyContent: "center", // Center the content vertically
          flex: 1,
          width: "100%",
          paddingTop: "0px", // Remove extra padding at the top
        }}
      >
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for the story"
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: "90%", // Make search bar span the entire width
            maxWidth: "1000px", // Add a max-width if you want to limit the width
            padding: "8px",
            fontSize: "1.2rem",
            fontFamily: "Georgia, 'Times New Roman', serif", // Consistent elegant font
            backgroundColor: "transparent", // Transparent background
            border: "none", // Remove the border
            color: "#6d4c41",
            textAlign: "center",
            outline: "none", // Remove outline on focus
            boxShadow: "none", // No box-shadow
            marginBottom: "10px", // Reduced margin between search and title
          }}
        />

        {/* Conditionally render story list based on search query */}
        <div
          style={{
            width: "90%", // Full width container with padding
            marginTop: "5px", // Reduced margin to tighten the layout
            fontFamily: "Georgia, 'Times New Roman', serif", // Consistent elegant font
            color: "#001a33", // Dark blue text color
            textAlign: "center", // Center the text horizontally
          }}
        >
          <h2
            style={{
              fontWeight: "bold", // Make the text bold
              fontSize: "2.5rem", // Make the text larger
              marginTop: "0px", // Remove space above the title
              marginBottom: "10px", // Reduced space below title
            }}
          >
            Your Diary Index
          </h2>
          {filteredStories.length === 0 ? (
            <p>No matching entries found.</p>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {filteredStories.map((story) => (
                <li
                  key={story._id}
                  style={{
                    padding: "5px", // Slight padding
                    margin: "3px 0", // Reduced margin between list items
                    fontSize: "1.2rem",
                    color: "#001a33", // Dark blue color
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleStoryClick(story._id)} // Use handleStoryClick to navigate
                >
                  {new Date(story.createdAt).toLocaleDateString("en-US")} : {story.title}
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
