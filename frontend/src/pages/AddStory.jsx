import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddStory = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleAddStory = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    const storyData = {
      title,
      content,
    };

    try {
      console.log("Starting to add story...");

      const response = await axios.post(
        "http://localhost:5000/api/story/add",
        storyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Story added successfully:", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error adding story:", error.response?.data || error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Full height
        backgroundImage:
          "linear-gradient(white 50px, transparent 0), linear-gradient(to right, white 50px, transparent 0)",
        backgroundSize: "100% 60px, 60px 100%",
        backgroundColor: "#fdf4dc",
        fontFamily: "Georgia, 'Times New Roman', serif", // Elegant font
      }}
    >
      {/* Navigation Bar */}
      <div
        style={{
          background: "#6d4c41",
          color: "white",
          padding: "20px",
          textAlign: "center",
          fontSize: "1.8rem",
          borderBottom: "3px solid #d6b18b",
        }}
      >
        Add Your Story
      </div>

      {/* Form Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          padding: "40px 20px",
        }}
      >
        <form
          onSubmit={handleAddStory}
          style={{
            width: "100%",
            maxWidth: "900px", // Max width for better responsiveness
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            type="text"
            placeholder="Enter story title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1.4rem",
              border: "1px solid #c5a880",
              borderRadius: "5px",
              marginBottom: "20px",
              background: "rgba(255, 255, 255, 0.9)",
              fontFamily: "Georgia, 'Times New Roman', serif", // Elegant font
              color: "#6d4c41",
            }}
          />
          <textarea
            placeholder="Write your story here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1.2rem",
              border: "1px solid #c5a880",
              borderRadius: "5px",
              minHeight: "300px", // Increased height here
              background: "rgba(255, 255, 255, 0.9)",
              fontFamily: "Georgia, 'Times New Roman', serif", // Elegant font
              color: "#6d4c41",
              marginBottom: "20px",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              background: "#6d4c41",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontFamily: "Georgia, 'Times New Roman', serif", // Elegant font
            }}
          >
            Submit Story
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStory;
