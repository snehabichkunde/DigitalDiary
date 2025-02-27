import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const AddStory = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isBackConfirmation, setIsBackConfirmation] = useState(false);
  const [selectedTags, setSelectedTags] = useState({
    isFavorite: false,
    isPoem: false,
    isBlog: false,
    isNotes: false,
    isJournal: false,
    isPersonal: false,
    isTravel: false,
    isReflective: false,
    isReminder: false,
    isHappy: false,
    isSad: false,
  });
  const navigate = useNavigate();
  const storyRef = useRef(null);

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
      ...selectedTags,
    };

    try {
      const response = await axios.post(
        "https://digitaldiary-vkw0.onrender.com/api/story/add",
        storyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        isDraft ? "Story saved to drafts" : "Story added successfully:",
        response.data
      );
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
    setIsBackConfirmation(true);
    setShowAlert(true);
  };

  const confirmBack = () => {
      saveStory(true);
    setShowAlert(false);
    setIsBackConfirmation(false);
    navigate("/home");
  };

  const cancelBack = () => {
    setShowAlert(false);
    setIsBackConfirmation(false);
  };

  const handleTagChange = (e) => {
    const { name, checked } = e.target;
    setSelectedTags((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSaveTags = () => {
    setShowAlert(false);
  };

  const commonButtonStyle = {
    backgroundColor: "#001a33",
    color: "white",
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "Georgia, 'Times New Roman', serif",
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
        marginLeft: "250px",
        width: "calc(100% - 250px)",
      }}
    >
      <NavBar />
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
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            justifyContent: "flex-start",
          }}
        >
          <button type="button" onClick={handleAddStory} style={commonButtonStyle}>
            Submit Story
          </button>
            <button type="button" onClick={handleAddToDraft} style={commonButtonStyle}>
            Save to Draft
          </button>
          <button
            type="button"
            onClick={() => setShowAlert(true)}
            style={commonButtonStyle}
          >
            Add Tags
          </button>
          <button type="button" onClick={handleBackClick} style={commonButtonStyle}>
            Back
          </button>
        </div>
      </form>
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
            {isBackConfirmation
              ? "Do you want to save the story to drafts before leaving?"
              : "Select tags for your story:"}
          </p>
          {!isBackConfirmation &&
            Object.keys(selectedTags).map((tag) => (
              tag !== "isDraft" && (
                <label
                  key={tag}
                  style={{ display: "block", marginBottom: "10px" }}
                >
                  <input
                    type="checkbox"
                    name={tag}
                    checked={selectedTags[tag]}
                    onChange={handleTagChange}
                  />
                  {tag.replace("is", "")}
                </label>
              )
            ))}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {isBackConfirmation ? (
                <>
                    <button
                      onClick={confirmBack}
                      style={commonButtonStyle}
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={cancelBack}
                      style={{
                        ...commonButtonStyle,
                        backgroundColor: "#f44336",
                      }}
                    >
                      Discard
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleSaveTags} style={commonButtonStyle}>
                      Save Tags
                    </button>
                    <button
                      onClick={cancelBack}
                      style={{
                        ...commonButtonStyle,
                        backgroundColor: "#f44336",
                      }}
                    >
                      Cancel
                    </button>
                  </>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStory;