import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./AddStory.css";

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

    if (id) fetchStory();

    const userAgent = navigator.userAgent;
    const isBraveBrowser = userAgent.includes("Chrome") && navigator.brave?.isBrave?.name === "isBrave";
    setIsBrave(isBraveBrowser);
    if (isBraveBrowser || !browserSupportsSpeechRecognition) {
      setRecordingStatus("Speech recognition is not supported in this browser.");
    }
  }, [id, browserSupportsSpeechRecognition]);

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
        { content: editedContent, ...editedTags, isDraft: false }
      );
      setIsEditing(false);
      setIsUnsaved(false);
      setStory((prev) => ({
        ...prev,
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
    if (isUnsaved) setShowAlert(true);
    else navigate("/home");
  };

  const saveAsDraft = async () => {
    try {
      const response = await axios.put(
        `https://digitaldiary-vkw0.onrender.com/api/storyRoutes/${id}`,
        { content: editedContent, ...editedTags, isDraft: true }
      );
      setIsUnsaved(false);
      setShowAlert(false);
      setStory((prev) => ({
        ...prev,
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

  const cancelBack = () => setShowAlert(false);

  const handleViewTags = () => {
    setIsViewingTags(true);
    setShowAlert(true);
  };

  const handleSaveTags = async () => {
    try {
      const response = await axios.put(
        `https://digitaldiary-vkw0.onrender.com/api/storyRoutes/${id}`,
        { content: editedContent, ...editedTags, isDraft: story.isDraft }
      );
      setStory((prev) => ({
        ...prev,
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
    setEditedTags((prev) => ({ ...prev, [name]: checked }));
    setIsUnsaved(true);
  };

  const toggleRecording = async () => {
    if (isBrave || !browserSupportsSpeechRecognition) {
      setRecordingStatus("Speech recognition is not supported in this browser. Use Chrome instead.");
      return;
    }
    if (!isEditing) {
      setRecordingStatus("Please switch to edit mode to record.");
      return;
    }
    if (!listening) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        setRecordingStatus("Recording... Speak your story.");
      } catch (error) {
        setRecordingStatus("Microphone access denied. Check permissions.");
      }
    } else {
      SpeechRecognition.stopListening();
      setEditedContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsUnsaved(true);
      setRecordingStatus("Recording stopped. Your speech has been added.");
      resetTranscript();
    }
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
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isUnsaved]);

  if (!story) return <div className="story-page"><NavBar /><p>Loading...</p></div>;

  return (
    <div className="story-page">
      <NavBar />
      <div className="story-container">
        <div className="story-box">
          <div className="date-display">
            {new Date(story.createdAt).toLocaleDateString("en-US")}
          </div>
          <div className="title-section">
            <label className="title-label">Title</label>
            <h1 className="title-input">{story.title}</h1>
          </div>
          <div className="story-form">
            <div className="content-section">
              {isEditing ? (
                <textarea
                  value={listening ? `${editedContent} ${transcript}` : editedContent}
                  onChange={(e) => {
                    setEditedContent(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="content-textarea"
                />
              ) : (
                <p className="content-textarea content-view">{story.content}</p>
              )}
              {recordingStatus && isEditing && (
                <p
                  className={`recording-status ${recordingStatus.includes("denied") || recordingStatus.includes("supported") ? "error" : ""}`}
                >
                  {recordingStatus}
                </p>
              )}
              {listening && (
                <div className="recording-indicator">
                  <span>🎙️ Recording in progress...</span>
                  <div className="pulse-dot" />
                </div>
              )}
            </div>
            <div className="button-group">
              <button onClick={handleBackClick} className="story-button">
                Back
              </button>
              <button onClick={handleViewTags} className="story-button">
                View/Edit Tags
              </button>
              {isEditing ? (
                <>
                  <button onClick={handleSubmit} className="story-button">
                    Submit
                  </button>
                  <button
                    onClick={toggleRecording}
                    disabled={isBrave || !browserSupportsSpeechRecognition}
                    className={`record-button ${listening ? "recording" : ""}`}
                  >
                    {listening ? "Stop Recording" : "Record Story"}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)} className="story-button">
                    Edit
                  </button>
                  <button onClick={handleDelete} className="secondary-button">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <div className="modal-overlay" onClick={isViewingTags ? closeTagModal : cancelBack}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {isViewingTags ? (
              <>
                <h2 className="modal-title">Edit Tags</h2>
                <div className="tags-grid">
                  {Object.keys(editedTags).map((tag) => (
                    <label key={tag} className="tag-label">
                      <input
                        type="checkbox"
                        name={tag}
                        checked={editedTags[tag]}
                        onChange={handleTagChange}
                        className="tag-checkbox"
                      />
                      <span>{tag.replace("is", "")}</span>
                    </label>
                  ))}
                </div>
                <div className="modal-buttons">
                  <button onClick={handleSaveTags} className="story-button">
                    Save Tags
                  </button>
                  <button onClick={closeTagModal} className="secondary-button">
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title">Save Before Leaving?</h2>
                <p>You have unsaved changes. Would you like to save them as a draft?</p>
                <div className="modal-buttons">
                  <button onClick={saveAsDraft} className="story-button">
                    Save as Draft
                  </button>
                  <button onClick={confirmBack} className="secondary-button">
                    Discard
                  </button>
                  <button onClick={cancelBack} className="tertiary-button">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;