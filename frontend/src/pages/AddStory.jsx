import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import NavBar from "../components/NavBar";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./AddStory.css"; 

const AddStory = () => {
  const [state, setState] = useState({
    // Story data
    title: "",
    content: "",
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
    
    // UI state
    currentDate: "",
    showModal: false,
    modalType: "",
    errorMessage: "",
    recordingStatus: "",
    isLoading: false,
    hasChanges: false
  });
  
  const navigate = useNavigate();
  const storyRef = useRef(null);
  const titleRef = useRef(null);

  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Set initial date
  useEffect(() => {
    const date = new Date();
    setState(prev => ({...prev, currentDate: date.toLocaleDateString()}));
    
    // Load draft from localStorage if available
    const savedDraft = localStorage.getItem("storyDraft");
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setState(prev => ({...prev, ...parsedDraft, hasChanges: false}));
      } catch (e) {
        // If parsing fails, just continue with empty form
      }
    }
    
    // Focus on title input when component mounts
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (state.hasChanges) {
      const draftData = {
        title: state.title,
        content: state.content,
        isFavorite: state.isFavorite,
        isPoem: state.isPoem,
        isBlog: state.isBlog,
        isNotes: state.isNotes,
        isJournal: state.isJournal,
        isPersonal: state.isPersonal,
        isTravel: state.isTravel,
        isReflective: state.isReflective,
        isReminder: state.isReminder,
        isHappy: state.isHappy,
        isSad: state.isSad,
      };
      
      localStorage.setItem("storyDraft", JSON.stringify(draftData));
    }
  }, [state.hasChanges, state.title, state.content, state.isFavorite, 
      state.isPoem, state.isBlog, state.isNotes, state.isJournal, 
      state.isPersonal, state.isTravel, state.isReflective, 
      state.isReminder, state.isHappy, state.isSad]);

  // Prevent accidental navigation when there are unsaved changes
  useBeforeUnload(
    useCallback(
      (event) => {
        if (state.hasChanges) {
          event.preventDefault();
          return (event.returnValue = 
            "You have unsaved changes. Are you sure you want to leave?");
        }
      },
      [state.hasChanges]
    )
  );

  // API calls with improved error handling
  const saveStory = useCallback(async (isDraft) => {
    // Basic validation
    if (!state.title.trim()) {
      setState(prev => ({
        ...prev, 
        showModal: true, 
        modalType: "error", 
        errorMessage: "Please add a title for your story."
      }));
      return;
    }

    if (!state.content.trim()) {
      setState(prev => ({
        ...prev, 
        showModal: true, 
        modalType: "error", 
        errorMessage: "Please add some content to your story."
      }));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setState(prev => ({
        ...prev, 
        showModal: true, 
        modalType: "error", 
        errorMessage: "No authentication token found. Please log in again."
      }));
      return;
    }

    setState(prev => ({...prev, isLoading: true}));
    
    try {
      const storyPayload = {
        title: state.title,
        content: state.content,
        isFavorite: state.isFavorite,
        isPoem: state.isPoem,
        isBlog: state.isBlog,
        isNotes: state.isNotes,
        isJournal: state.isJournal,
        isPersonal: state.isPersonal,
        isTravel: state.isTravel,
        isReflective: state.isReflective,
        isReminder: state.isReminder,
        isHappy: state.isHappy,
        isSad: state.isSad,
        isDraft
      };
      
      const response = await axios.post(
        "https://digitaldiary-vkw0.onrender.com/api/story/add",
        storyPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Clear draft from localStorage after successful save
      localStorage.removeItem("storyDraft");
      
      navigate("/home");
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
        "Failed to save your story. Please try again.";
      setState(prev => ({
        ...prev, 
        showModal: true, 
        modalType: "error", 
        errorMessage: errorMsg
      }));
    } finally {
      setState(prev => ({...prev, isLoading: false}));
    }
  }, [state, navigate]);

  // Debounced input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setState(prev => ({
      ...prev,
      [name]: newValue,
      hasChanges: true
    }));
  }, []);

  const handleTitleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (storyRef.current) {
        storyRef.current.focus();
      }
    }
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({...prev, showModal: false, modalType: "", errorMessage: ""}));
  }, []);

  // Optimized speech recording handlers
  const startRecording = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      setState(prev => ({
        ...prev, 
        recordingStatus: "Speech recognition is not supported in this browser. Use Chrome instead."
      }));
      return;
    }
    
    SpeechRecognition.startListening({ 
      continuous: true, 
      language: 'en-IN' 
    });
    
    setState(prev => ({
      ...prev, 
      recordingStatus: "Recording... Speak your story."
    }));
  }, [browserSupportsSpeechRecognition]);

  const pauseRecording = useCallback(() => {
    SpeechRecognition.stopListening();
    setState(prev => ({
      ...prev,
      content: prev.content ? `${prev.content} ${transcript}` : transcript,
      hasChanges: true,
      recordingStatus: "Recording paused. Resume or stop to continue."
    }));
    resetTranscript();
  }, [transcript]);

  const resumeRecording = useCallback(() => {
    SpeechRecognition.startListening({ 
      continuous: true, 
      language: 'en-IN' 
    });
    setState(prev => ({
      ...prev,
      recordingStatus: "Recording resumed... Speak your story."
    }));
  }, []);

  const stopRecording = useCallback(() => {
    SpeechRecognition.stopListening();
    setState(prev => ({
      ...prev,
      content: prev.content ? `${prev.content} ${transcript}` : transcript,
      hasChanges: true,
      recordingStatus: "Recording stopped. Your speech has been added to the story."
    }));
    resetTranscript();
  }, [transcript]);

  const confirmNavigateAway = useCallback(() => {
    closeModal();
    navigate("/home");
  }, [closeModal, navigate]);

  const handleSaveDraftAndLeave = useCallback(() => {
    saveStory(true);
    closeModal();
  }, [saveStory, closeModal]);

  // Handle browser speech recognition compatibility check
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="add-story-container">
        <NavBar />
        <div className="browser-compatibility-message">
          <h2>Browser Compatibility Issue</h2>
          <p>
            Speech recognition is not supported in this browser. 
            Please use Chrome or another compatible browser.
          </p>
          <button
            className="primary-button"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { 
    title, content, currentDate, showModal, modalType, 
    errorMessage, recordingStatus, isLoading 
  } = state;

  return (
    <div className="add-story-container">
      <NavBar />
      
      <div className="date-display" aria-label="Current date">
        {currentDate}
      </div>
      
      <div className="title-section">
        <label htmlFor="story-title" className="title-label">
          Title:
        </label>
        <input
          id="story-title"
          ref={titleRef}
          name="title"
          value={title}
          onChange={handleInputChange}
          onKeyDown={handleTitleKeyDown}
          placeholder="Write your title here..."
          className="title-input"
          aria-label="Story title"
        />
      </div>
      
      <form className="story-form" onSubmit={(e) => e.preventDefault()}>
        <div className="content-container">
          <textarea
            ref={storyRef}
            name="content"
            placeholder="Write your story here or use the Record Story button..."
            value={listening ? `${content} ${transcript}` : content}
            onChange={handleInputChange}
            className="content-textarea"
            aria-label="Story content"
          />
          
          <div className="word-count">
            {content ? content.trim().split(/\s+/).length : 0} words
          </div>
        </div>
        
        <div className="button-container">
          <button 
            type="button" 
            onClick={() => saveStory(false)} 
            className="primary-button"
            disabled={isLoading}
            aria-label="Submit story"
          >
            {isLoading ? "Submitting..." : "Submit Story"}
          </button>
          
          <button 
            type="button" 
            onClick={() => saveStory(true)} 
            className="primary-button"
            disabled={isLoading}
            aria-label="Save to draft"
          >
            {isLoading ? "Saving..." : "Save to Draft"}
          </button>
          
          <button
            type="button"
            onClick={() => setState(prev => ({...prev, showModal: true, modalType: "tags"}))}
            className="primary-button"
            disabled={isLoading}
            aria-label="Add tags"
          >
            Add Tags
          </button>
          
          <button 
            type="button" 
            onClick={() => setState(prev => ({...prev, showModal: true, modalType: "backConfirmation"}))} 
            className="primary-button"
            disabled={isLoading}
            aria-label="Back to home"
          >
            Back
          </button>
          
          {!listening ? (
            <button
              type="button"
              onClick={startRecording}
              className="primary-button"
              disabled={isLoading}
              aria-label="Start recording"
            >
              Record Story
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={pauseRecording}
                className="primary-button"
                disabled={isLoading}
                aria-label="Pause recording"
              >
                Pause Recording
              </button>
              <button
                type="button"
                onClick={resumeRecording}
                className="primary-button"
                disabled={isLoading}
                aria-label="Resume recording"
              >
                Resume Recording
              </button>
              <button
                type="button"
                onClick={stopRecording}
                className="primary-button recording-button"
                disabled={isLoading}
                aria-label="Stop recording"
              >
                Stop Recording
              </button>
            </>
          )}
        </div>
        
        {recordingStatus && (
          <p className={`recording-status ${recordingStatus.includes("not supported") ? "error-text" : ""}`}
             aria-live="polite">
            {recordingStatus}
          </p>
        )}
        
        {listening && (
          <div className="recording-indicator" role="status" aria-live="assertive">
            <span>🎙️ Recording in progress...</span>
            <div className="recording-pulse-dot" />
          </div>
        )}
      </form>

      {/* Modal Dialog */}
      {showModal && (
        <div 
          className="modal-overlay" 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Escape') closeModal();
            }}
            tabIndex={0}
          >
            <h2 className="modal-title" id="modal-title">
              {modalType === "error" ? "Error" : 
               modalType === "backConfirmation" ? "Save before leaving?" : 
               "Select Tags for Your Story"}
            </h2>

            {modalType === "error" && (
              <p className="error-message">{errorMessage}</p>
            )}

            {modalType === "tags" && (
              <div className="tags-grid" role="group" aria-label="Story tags">
                {Object.keys(state)
                  .filter(key => key.startsWith("is") && key !== "isLoading")
                  .map(tag => (
                    <label key={tag} className="tag-label">
                      <input
                        type="checkbox"
                        name={tag}
                        checked={state[tag]}
                        onChange={handleInputChange}
                        className="tag-checkbox"
                        aria-label={tag.replace("is", "")}
                      />
                      <span>{tag.replace("is", "")}</span>
                    </label>
                  ))}
              </div>
            )}

            <div className="modal-buttons">
              {modalType === "backConfirmation" ? (
                <>
                  <button 
                    onClick={handleSaveDraftAndLeave} 
                    className="primary-button"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={confirmNavigateAway}
                    className="secondary-button"
                  >
                    Discard
                  </button>
                  <button
                    onClick={closeModal}
                    className="tertiary-button"
                  >
                    Cancel
                  </button>
                </>
              ) : modalType === "tags" ? (
                <>
                  <button onClick={closeModal} className="primary-button">
                    Save Tags
                  </button>
                  <button onClick={closeModal} className="secondary-button">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={closeModal} className="primary-button">
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStory;