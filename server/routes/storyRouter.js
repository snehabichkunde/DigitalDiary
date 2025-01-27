import express from "express";
import Story from "../models/Story.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: "Error fetching story", error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Debugging request body

    const updatedFields = {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.content && { content: req.body.content }),
      ...(typeof req.body.isDraft === "boolean" && { isDraft: req.body.isDraft }),
    };

    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedStory) return res.status(404).json({ message: "Story not found" });
    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: "Error updating story", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    if (!deletedStory) return res.status(404).json({ message: "Story not found" });
    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting story", error });
  }
});

export default router;
