//auth.js
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const jwtSecret = "sneha's_dairy.jwtsecrt"; 

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Received data:', { name, email, password });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        return res.status(201).json({ success: true, message: 'Account created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error creating account' });
    }
});



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5h' });

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