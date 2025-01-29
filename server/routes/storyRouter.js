import express from "express";
import Story from "../models/Story.js";

const router = express.Router();


router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    console.error("Error fetching story:", error); // Log the error
    res.status(500).json({ message: "Error fetching story", error: error.message });
  }
});



router.put("/:id", async (req, res) => {
  try {
      console.log("Incoming request body:", req.body); // Debugging request body
     const { title, content, isDraft, ...tags } = req.body;

      const updatedFields = {};

      if (title) updatedFields.title = title;
      if (content) updatedFields.content = content;

      if (typeof isDraft === 'boolean') updatedFields.isDraft = isDraft;

      for (const tag in tags) {
          if (tag.startsWith('is')) {
            updatedFields[tag] = tags[tag]
          }
      }

    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(updatedStory);
  } catch (error) {
    console.error("Error updating story:", error); // Log the error
    res.status(500).json({ message: "Error updating story", error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    if (!deletedStory) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error); // Log the error
    res.status(500).json({ message: "Error deleting story", error: error.message });
  }
});

export default router;