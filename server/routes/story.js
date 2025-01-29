import express from "express";
import Story from "../models/Story.js";
import { verifyToken } from "./middleware.js";

const router = express.Router();

router.post("/add", verifyToken, async (req, res) => {
  try {
    const { title, content, isDraft, ...tags } = req.body;
    

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const tagFields = {
      isPoem: typeof tags.isPoem === 'boolean' ? tags.isPoem : false,
      isFavorite: typeof tags.isFavorite === 'boolean' ? tags.isFavorite : false,
      isBlog: typeof tags.isBlog === 'boolean' ? tags.isBlog : false,
      isNotes: typeof tags.isNotes === 'boolean' ? tags.isNotes : false,
      isJournal: typeof tags.isJournal === 'boolean' ? tags.isJournal : false,
      isPersonal: typeof tags.isPersonal === 'boolean' ? tags.isPersonal : false,
      isTravel: typeof tags.isTravel === 'boolean' ? tags.isTravel : false,
      isReflective: typeof tags.isReflective === 'boolean' ? tags.isReflective : false,
      isReminder: typeof tags.isReminder === 'boolean' ? tags.isReminder : false,
      isHappy: typeof tags.isHappy === 'boolean' ? tags.isHappy : false,
      isSad: typeof tags.isSad === 'boolean' ? tags.isSad : false,
    };

    // Create the story document with tags and isDraft
    const newStory = new Story({
      title,
      content,
      userId: req.user.id,
      isDraft: typeof isDraft === 'boolean' ? isDraft : false, // Handle isDraft here
      ...tagFields,  // Spread all the tag fields into the story document
    });

    // Save the story
    await newStory.save();

    return res.status(201).json({ message: "Story added successfully", story: newStory });
  } catch (error) {
    console.error("Error adding story:", error);
    return res.status(500).json({ message: "Error adding story", error: error.message });
  }
});





router.get("/all", verifyToken, async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.user.id });
    return res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return res.status(500).json({ message: "Error fetching stories" });
  }
});

router.get("/draft", verifyToken, async (req, res) => {
  try {
    const drafts = await Story.find({ userId: req.user.id, isDraft: true });
    return res.status(200).json(drafts);
  } catch (error) {
    console.error("Failed to fetch drafts:", error);
    return res.status(500).json({ message: "Failed to fetch drafts", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newStory = new Story(req.body);
    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ message: "Error saving story", error });
  }
});


export default router;
