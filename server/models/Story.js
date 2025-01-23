import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

const Story = mongoose.model("Story", storySchema);
export default Story;
