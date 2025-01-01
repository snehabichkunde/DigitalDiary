import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/e_dairy");
        console.log("Connected to MongoDB");
    }catch(error){
        console.log("Error connecting to MongoDB", error.massage);
    }
};

export default connectToMongoDB;