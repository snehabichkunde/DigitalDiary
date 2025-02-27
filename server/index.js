import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongoDB from "./db/db.js";
import authRouter from "./routes/auth.js";
import story from "./routes/story.js"; 
import storyRoutes from "./routes/storyRouter.js";

dotenv.config();

const app = express();
app.get("/", (req, res) => {
  res.send("Server is running!");
});


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/story", story);
app.use("/api/storyRoutes", storyRoutes);
app.use("/api/story/drafts", story);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});