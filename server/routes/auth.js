import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';


const router = express.Router();

router.post('/register', async (req, res) => { // Corrected route
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        return res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Error creating account' });
    }
});


export default router;