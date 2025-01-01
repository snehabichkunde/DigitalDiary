import mongoose from "mongoose";

const UserScema = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
});

const User = mongoose.model('User', UserScema);

export default User;  