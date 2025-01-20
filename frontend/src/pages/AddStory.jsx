import React, { useState } from "react";
import axios from "axios";

const AddStory = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, content }; 

    const myToken = localStorage.getItem('token'); 
    console.log("Token being sent:", myToken);

    console.log("Token: ", myToken); 
    try {
      const response = await axios.post('http://localhost:5000/api/story/add', data, {
        headers: {
          'Authorization': `Bearer ${myToken}`,
        },
      });

      console.log(response.data); 
      if (response.data.message === "Story added successfully") {
        alert("Your story has been submitted!");
        setTitle("");
        setContent("");
      } else {
        console.log("Unexpected message:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting story:", error);
      alert("There was an error submitting your story. Please try again later.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Add Your Story</h2>
      <form onSubmit={handleSubmit}>
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
