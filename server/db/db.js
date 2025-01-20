import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/e_dairy");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectToMongoDB;
