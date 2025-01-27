import mongoose from "mongoose";

// Define Story schema
const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    isDraft: { type: Boolean, default: false },
    // isFavourite: { type: Boolean, default: false }, 
  },
  {
    timestamps: true, 
  }
);

const Story = mongoose.model("Story", storySchema);
export default Story;
