import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const StoryDetail = () => {
  const { id } = useParams();  // Extract id from the URL
  const [story, setStory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/storyRoutes/${id}`);
        setStory(response.data);
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  if (!story) {
    return <p>Loading...</p>;
  }

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#fdf4dc",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "20px",
        position: "relative",
        backgroundImage: `url('/rose.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Date Section */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "1rem",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#001a33",
          textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
        }}
      >
        {new Date(story.createdAt).toLocaleDateString("en-US")}
      </div>

      {/* Title Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <label
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#001a33",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
            marginRight: "10px",
          }}
        >
          Title:
        </label>
        <h1
          style={{
            fontSize: "1.5rem",
            color: "#001a33",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          {story.title}
        </h1>
      </div>

      {/* Story Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontSize: "1.2rem",
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "#001a33",
            lineHeight: "24px",
            marginTop: "10px",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          {story.content}
        </p>
      </div>

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#001a33",
          color: "white",
          padding: "8px 16px",
          fontSize: "1rem",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        Back
      </button>
    </div>
  );
};

export default StoryDetail;
