import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const AddStory = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showAlert, setShowAlert] = useState(false); // State for showing the alert
  const navigate = useNavigate();
  const storyRef = useRef(null); // Reference to the story textarea

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString());
  }, []);

  const saveStory = async (isDraft) => { 
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    const storyData = {
      title,
      content,
      isDraft, 
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/story/add",
        storyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(isDraft ? "Story saved to drafts" : "Story added successfully:", response.data);

        navigate("/home");
    } catch (error) {
      console.error("Error saving story:", error.response?.data || error.message);
    }
  };

  const handleAddStory = (e) => {
    e.preventDefault();
    saveStory(false); 
  };

  const handleAddToDraft = (e) => {
    e.preventDefault();
    saveStory(true); 
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      storyRef.current.focus();
    }
  };

  const handleBackClick = () => {
    setShowAlert(true);
  };

  const confirmBack = () => {
    saveStory(true); 
    setShowAlert(false);
    navigate("/home"); 
  };

  const cancelBack = () => {
    setShowAlert(false);
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
        marginLeft: "250px", // Adjust based on the sidebar width
        width: "calc(100% - 250px)", // Adjust based on the sidebar width
      }}
    >
      <NavBar />
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
        {currentDate}
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
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleTitleKeyDown}
          placeholder="Write your title here..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "1.2rem",
            fontFamily: "Georgia, 'Times New Roman', serif",
            background: "transparent",
            color: "#001a33",
            lineHeight: "24px",
            padding: "10px",
            marginBottom: "10px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>

      {/* Story Section */}
      <form
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <textarea
          ref={storyRef}
          placeholder="Write your story here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "1.2rem",
            fontFamily: "Georgia, 'Times New Roman', serif",
            background: "transparent",
            color: "#001a33",
            resize: "none",
            lineHeight: "24px",
            padding: "10px",
            marginTop: "10px",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={handleAddStory}
            style={{
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
            Submit Story
          </button>
          <button
            onClick={handleAddToDraft}
            style={{
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
            Save to Draft
          </button>
        </div>
      </form>

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

      {/* Alert Dialog */}
      {showAlert && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
            Your story won't be saved. Do you want to save it to drafts before going back?
          </p>
          <button
            onClick={confirmBack}
            style={{
              backgroundColor: "#001a33",
              color: "white",
              padding: "8px 16px",
              fontSize: "1rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Yes, Save to Draft
          </button>
          <button
            onClick={cancelBack}
            style={{
              backgroundColor: "#001a33",
              color: "white",
              padding: "8px 16px",
              fontSize: "1rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            No, Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AddStory;
