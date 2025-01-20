import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true }, 
});

const Story = mongoose.model("Story", storySchema);
export default Story;
