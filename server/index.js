import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectToMongoDB from "./db/db.js";
import authRouter from './routes/auth.js';
import storyRouter from "./routes/Story.js";  

const app = express();
dotenv.config();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use("/api/story", storyRouter); 

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  connectToMongoDB(); 
  console.log(`Server is running on port ${PORT}`);
});
