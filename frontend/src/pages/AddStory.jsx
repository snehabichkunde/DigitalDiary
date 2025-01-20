import React, { useState } from "react";
import axios from "axios";

const AddStory = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddStory = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }
  
    const storyData = {
      title, 
      content
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
    } catch (error) {
      console.error("Error adding story:", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Add Your Story</h2>
      <form onSubmit={handleAddStory}>
        <input
          type="text"
          placeholder="Enter story title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            fontSize: "16px",
          }}
        />
        <textarea
          placeholder="Write your story here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            fontSize: "16px",
            minHeight: "150px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit Story
        </button>
      </form>
    </div>
  );
};

export default AddStory;
