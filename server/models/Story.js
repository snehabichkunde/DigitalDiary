import mongoose from "mongoose";

// Define Story schema
const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    isDraft: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    isPoem: { type: Boolean, default: false },
    isBlog: { type: Boolean, default: false },
    isNotes: { type: Boolean, default: false },
    isJournal: { type: Boolean, default: false },
    isPersonal: { type: Boolean, default: false },
    isTravel: { type: Boolean, default: false },
    isReflective: { type: Boolean, default: false },
    isReminder: { type: Boolean, default: false },
    isHappy: { type: Boolean, default: false },
    isSad: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model("Story", storySchema);
export default Story;
