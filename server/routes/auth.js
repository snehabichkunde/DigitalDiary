import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = "sneha's_dairy"; // Replace with a secure key

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Log the incoming data for debugging
        console.log('Received data:', { name, email, password });

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: 'Email already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        // Save the new user
        await newUser.save();
        return res.status(201).json({ success: true, message: 'Account created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error creating account' });
    }
});



// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '5h' });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error logging in' });
    }
});


export default router;