import express from "express";
import Story from "../models/Story.js";
import { verifyToken } from "./middleware.js";

const router = express.Router();

router.post("/add", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newStory = new Story({
      title,
      content,
      userId: req.user.id, // From the verified token
    });

    await newStory.save();

    return res.status(201).json({ message: "Story added successfully", story: newStory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding story" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.user.id }); // Fetch stories by user ID
    return res.status(200).json({ stories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching stories" });
  }
});

export default router;