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
      ...(typeof req.body.isDraft === "boolean" && { isDraft: req.body.isDraft }), // Ensure we update isDraft here
      ...(req.body.tags && {
        isPoem: req.body.tags.isPoem !== undefined ? req.body.tags.isPoem : false,
        isFavorite: req.body.tags.isFavorite !== undefined ? req.body.tags.isFavorite : false,
        isBlog: req.body.tags.isBlog !== undefined ? req.body.tags.isBlog : false,
        isNotes: req.body.tags.isNotes !== undefined ? req.body.tags.isNotes : false,
        isJournal: req.body.tags.isJournal !== undefined ? req.body.tags.isJournal : false,
        isPersonal: req.body.tags.isPersonal !== undefined ? req.body.tags.isPersonal : false,
        isTravel: req.body.tags.isTravel !== undefined ? req.body.tags.isTravel : false,
        isReflective: req.body.tags.isReflective !== undefined ? req.body.tags.isReflective : false,
        isReminder: req.body.tags.isReminder !== undefined ? req.body.tags.isReminder : false,
        isHappy: req.body.tags.isHappy !== undefined ? req.body.tags.isHappy : false,
        isSad: req.body.tags.isSad !== undefined ? req.body.tags.isSad : false,
      }),
    };

    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedStory) return res.status(404).json({ message: "Story not found" });
    res.json(updatedStory);
  } catch (error) {
    console.error("Error updating story:", error);
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
