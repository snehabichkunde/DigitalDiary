import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const StoryDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State to control the alert visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/storyRoutes/${id}`);
        setStory(response.data);
        setEditedContent(response.data.content); 
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/storyRoutes/${id}`);
      navigate("/home");
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/storyRoutes/${id}`, {
        content: editedContent, 
      });
      setIsEditing(false);
      setIsUnsaved(false);
      setStory((prevStory) => ({
        ...prevStory,
        content: editedContent,
        createdAt: new Date().toISOString(),
      }));
      navigate("/home");
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  const handleBackClick = () => {
    if (isUnsaved) {
      setShowAlert(true); // Show alert dialog if there are unsaved changes
    } else {
      navigate("/home");
    }
  };

  const confirmBack = () => {
    navigate("/home");
    setShowAlert(false); // Close the alert dialog after confirming
  };

  const cancelBack = () => {
    setShowAlert(false); // Close the alert dialog without navigating
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isUnsaved) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUnsaved]);

  if (!story) {
    return <p>Loading...</p>;
  }

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
            whiteSpace: "pre-wrap", // Preserves spaces and line breaks
          }}
        >
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => {
                setEditedContent(e.target.value);
                setIsUnsaved(true);
              }}
              rows="10"
              style={{
                width: "100%",
                fontSize: "1.2rem",
                padding: "10px",
                fontFamily: "Georgia, 'Times New Roman', serif",
                backgroundColor: "#fdf4dc",
                borderRadius: "5px",
                border: "none",
                color: "#001a33",
                boxSizing: "border-box",
                whiteSpace: "pre-wrap", // Preserves spaces and line breaks
                outline: "none", // Remove the blue outline
              }}
            />
          ) : (
            story.content
          )}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        {isEditing ? (
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#001a33",
              color: "white",
              padding: "8px 16px",
              fontSize: "1rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: "#001a33",
                color: "white",
                padding: "8px 16px",
                fontSize: "1rem",
                fontWeight: "bold",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "8px 16px",
                fontSize: "1rem",
                fontWeight: "bold",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <button
        onClick={handleBackClick}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          backgroundColor: "#001a33",
          color: "white",
          padding: "8px 16px",
          fontSize: "1rem",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
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
            Your story won't be saved. Are you sure you want to go back?
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
            OK
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
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;
