import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const StoryDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isViewingTags, setIsViewingTags] = useState(false);
  const [editedTags, setEditedTags] = useState({});
  const navigate = useNavigate();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [recordingStatus, setRecordingStatus] = useState("");
  const [isBrave, setIsBrave] = useState(false);
  const [lastTranscript, setLastTranscript] = useState(""); // Track previous transcript

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(
          `https://digitaldiary-vkw0.onrender.com/api/storyRoutes/${id}`
        );
        setStory(response.data);
        setEditedContent(response.data.content);
        setEditedTags(
          Object.keys(response.data)
            .filter((key) => key.startsWith("is"))
            .reduce((obj, key) => {
              obj[key] = response.data[key];
              return obj;
            }, {})
        );
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    if (id) {
      fetchStory();
    }

    const userAgent = navigator.userAgent;
    const isBraveBrowser =
      userAgent.includes("Chrome") && navigator.brave?.isBrave?.name === "isBrave";
    setIsBrave(isBraveBrowser);
    if (isBraveBrowser || !browserSupportsSpeechRecognition) {
      setRecordingStatus("Speech recognition is not supported in this browser. ");
    }
  }, [id, browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (listening && !isBrave && browserSupportsSpeechRecognition && transcript && isEditing) {
      const newWords = transcript.slice(lastTranscript.length).trim();
      if (newWords) {
        setEditedContent((prevContent) => prevContent + (prevContent ? " " : "") + newWords);
        setLastTranscript(transcript);
        setIsUnsaved(true);
      }
    }
  }, [transcript, listening, isBrave, browserSupportsSpeechRecognition, isEditing]);

  // Reset transcript when recording stops
  useEffect(() => {
    if (!listening && !isBrave && browserSupportsSpeechRecognition) {
      setLastTranscript("");
      resetTranscript();
      setRecordingStatus("Recording stopped.");
    }
  }, [listening, isBrave, browserSupportsSpeechRecognition]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://digitaldiary-vkw0.onrender.com/api/storyRoutes/${id}`);
      navigate("/home");
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `https://digitaldiary-vkw0.onrender.com/api/storyRoutes/${id}`,
        {
          content: editedContent,
          ...editedTags,
          isDraft: false,
        }
      );
      setIsEditing(false);
      setIsUnsaved(false);
      setStory((prevStory) => ({
        ...prevStory,
        content: editedContent,
        ...editedTags,
        isDraft: false,
        createdAt: response.data.createdAt,
      }));
      navigate("/home");
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  const handleBackClick = () => {
    if (isUnsaved) {
      setShowAlert(true);
    } else {
      navigate("/home");
    }
  };

  const saveAsDraft = async () => {
    try {
      const response = await axios.put(`https://digitaldiary-vkw0.onrender.com/api/storyRoutes/${id}`, {
        content: editedContent,
        ...editedTags,
        isDraft: true,
      });
      setIsUnsaved(false);
      setShowAlert(false);
      setStory((prevStory) => ({
        ...prevStory,
        content: editedContent,
        ...editedTags,
        isDraft: true,
        createdAt: response.data.createdAt,
      }));
      navigate("/home");
    } catch (error) {
      console.error("Error saving story as draft:", error);
    }
  };

  const confirmBack = () => {
    setShowAlert(false);
    navigate("/home");
  };

  const cancelBack = () => {
    setShowAlert(false);
  };

  const handleViewTags = () => {
    setIsViewingTags(true);
    setShowAlert(true);
  };

  const handleSaveTags = async () => {
    try {
      const response = await axios.put(
        `https://digitaldiary-vkw0.onrender.com/api/storyRoutes/${id}`,
        {
          content: editedContent,
          ...editedTags,
          isDraft: story.isDraft, // Preserve draft status
        }
      );
      setStory((prevStory) => ({
        ...prevStory,
        ...editedTags,
        createdAt: response.data.createdAt,
      }));
      setIsViewingTags(false);
      setShowAlert(false);
    } catch (error) {
      console.error("Error saving tags:", error);
    }
  };

  const closeTagModal = () => {
    setIsViewingTags(false);
    setShowAlert(false);
  };

  const handleTagChange = (e) => {
    const { name, checked } = e.target;
    setEditedTags((prevTags) => ({ ...prevTags, [name]: checked }));
    setIsUnsaved(true);
  };

  // Speech recording handlers
  const startRecording = async () => {
    if (isBrave || !browserSupportsSpeechRecognition) {
      setRecordingStatus("Speech recognition is not supported in this browser. Use Chrome instead.");
      return;
    }
    if (!isEditing) {
      setRecordingStatus("Please switch to edit mode to record.");
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
        language: "en-IN", 
      });
      setRecordingStatus("Recording... Speak your story.");
    } catch (error) {
      setRecordingStatus("Microphone access denied. Check permissions.");
    }
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
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
            whiteSpace: "pre-wrap",
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
                whiteSpace: "pre-wrap",
                outline: "none",
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
          left: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        <button onClick={handleBackClick} style={commonButtonStyle}>
          Back
        </button>
        <button onClick={handleViewTags} style={commonButtonStyle}>
          View/Edit Tags
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        {isEditing ? (
          <>
            <button onClick={handleSubmit} style={commonButtonStyle}>
              Submit
            </button>
            <button
              onClick={listening ? stopRecording : startRecording}
              disabled={isBrave || !browserSupportsSpeechRecognition}
              style={{
                ...commonButtonStyle,
                backgroundColor: listening ? "#f44336" : "#4CAF50",
                opacity: (isBrave || !browserSupportsSpeechRecognition) && !listening ? 0.5 : 1,
                cursor: (isBrave || !browserSupportsSpeechRecognition) && !listening ? "not-allowed" : "pointer",
              }}
            >
              {listening ? "Stop Recording" : "Record"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsEditing(true);
              }}
              style={commonButtonStyle}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              style={{
                ...commonButtonStyle,
                backgroundColor: "red",
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {recordingStatus && isEditing && (
        <p
          style={{
            marginTop: "10px",
            color: recordingStatus.includes("denied") || recordingStatus.includes("supported") ? "red" : "#001a33",
            position: "absolute",
            bottom: "60px",
            right: "20px",
          }}
        >
          {recordingStatus}
        </p>
      )}

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
            width: "90%",
            maxWidth: "450px",
          }}
        >
          {isViewingTags ? (
            <>
              <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
                Edit Tags
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "10px",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                {Object.keys(editedTags).map((tag) => (
                  <label
                    key={tag}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      color: "#001a33",
                      textTransform: "capitalize",
                    }}
                  >
                    <input
                      type="checkbox"
                      name={tag}
                      checked={editedTags[tag]}
                      onChange={handleTagChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#001a33",
                        cursor: "pointer",
                      }}
                    />
                    {tag.replace("is", "")}
                  </label>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button onClick={handleSaveTags} style={commonButtonStyle}>
                  Save Tags
                </button>
                <button onClick={closeTagModal} style={commonButtonStyle}>
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
                You have unsaved changes. Would you like to save them as a draft before leaving?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <button onClick={saveAsDraft} style={commonButtonStyle}>
                  Save as Draft
                </button>
                <button onClick={confirmBack} style={commonButtonStyle}>
                  Don't Save
                </button>
                <button onClick={cancelBack} style={commonButtonStyle}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryDetail;