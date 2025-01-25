import mongoose from "mongoose";

// Define Story schema
const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create a Story model using the schema
const Story = mongoose.model("Story", storySchema);
export default Story;
